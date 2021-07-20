//import { BaseClient } from './BaseClient'
import * as aws4 from 'aws4'
import axios from 'axios'
import createDebug from 'debug'
const debug = createDebug('common:clients:AwsIamClient')
export class AwsIamClient /*extends BaseClient*/ {
    accessKeyId
    secretAccessKey
    apiVersion = '2010-05-08'

    apiURL = () => { return 'https://iam.amazonaws.com' }

    async init(accessKeyId, secretAccessKey) {
        this.accessKeyId = accessKeyId
        this.secretAccessKey = secretAccessKey
        //await super.init()
    }

    sendRequest = async (action: string, params?: any) => {
        const opts = {
            host: new URL(this.apiURL()).host,
            method: 'GET',
            url: `${this.apiURL()}`,
            path: `/?Version=${this.apiVersion}&Action=${action}`,
            service: 'iam',
            params: {
                Version: this.apiVersion,
                Action: action,
                ...params
            },
        }
        if (params) {
            for (const key of Object.keys(params))
                opts.path += `&${key}=${params[key]}`
        }

        const signedRequest = aws4.sign(opts,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    getRoles = async (roleType: 'ec2' | 'eks') => {
        const response = await this.sendRequest('ListRoles')
        return response.data?.ListRolesResponse?.ListRolesResult?.Roles?.filter(item => item.Path === '/' && JSON.parse(decodeURIComponent(item.AssumeRolePolicyDocument))?.Statement?.some(subItem => subItem.Principal?.Service === `${roleType}.amazonaws.com`))
    }

    createRole = async (roleName: string, spec: any) => {
        const response = await this.sendRequest('CreateRole',
        {
            'RoleName': roleName,
            'Path': '/',
            'AssumeRolePolicyDocument': JSON.stringify(spec)
        })
        return response.data?.CreateRoleResponse?.CreateRoleResult?.Role
    }

    getRoleAttachedPolicies = async (roleName: string) => {
        const response = await this.sendRequest('ListAttachedRolePolicies',
            {
                'RoleName': roleName
            })
        return response.data?.ListAttachedRolePoliciesResponse?.ListAttachedRolePoliciesResult?.AttachedPolicies?.map(item => item.PolicyArn)
    }

    attachRolePolicy = async (roleName: string, policyArn: string) => {
        const response = await this.sendRequest('AttachRolePolicy',
            {
                'RoleName': roleName,
                'PolicyArn': policyArn
            })
        return response.data?.ListAttachedRolePoliciesResponse?.ListAttachedRolePoliciesResult?.AttachedPolicies?.map(item => item.PolicyArn)
    }

    getCustomPolicies = async () => {
        const response = await this.sendRequest('ListPolicies',
        {
            'Scope': 'Local' // i.e.: custom policies
        })
        return response.data?.ListPoliciesResponse?.ListPoliciesResult?.Policies
    }

    createPolicy = async (policyName: string, spec: any) => {
        const response = await this.sendRequest('CreatePolicy',
        {
            'PolicyName': policyName,
            'PolicyDocument': JSON.stringify(spec)
        })
        return response.data?.CreatePolicyResponse?.CreatePolicyResult?.Policy
    }

    eksClusterInlinePolicy = () => ({
        Version: '2012-10-17',
        Statement: [{
            Effect: 'Allow',
            Principal: {
                Service: 'eks.amazonaws.com'
            },
            Action: 'sts:AssumeRole'
        }]
    })

    ec2NodeGroupInlinePolicy = () => ({
        Version: '2012-10-17',
        Statement: [{
            Effect: 'Allow',
            Principal: {
                Service: 'ec2.amazonaws.com'
            },
            Action: 'sts:AssumeRole'
        }]
    })

    eksCustomPolicy = () => ({
        Version: '2012-10-17',
        Statement: [{
                Effect: 'Allow',
                Action: [
                    'eks:*'
                ],
                Resource: '*'
            },
            {
                Effect: 'Allow',
                Action: 'iam:PassRole',
                Resource: '*',
                Condition: {
                    StringEquals: {
                        'iam:PassedToService': 'eks.amazonaws.com'
                    }
                }
            }]
    })

    getCustomPolicy = async (): Promise<any> => {
        const policies = await this.getCustomPolicies()
        let codeZeroEksPolicy = policies?.find(item => item.PolicyName === 'CodeZeroEksPolicy')
        if (!codeZeroEksPolicy) {
            debug('Creating CodeZeroEksPolicy')
            codeZeroEksPolicy = await this.createPolicy('CodeZeroEksPolicy', this.eksCustomPolicy())
        }
        return codeZeroEksPolicy
    }

    getClusterRole = async (): Promise<any> => {
        const clusterRoles = await this.getRoles('eks')
        let codeZeroClusterRole = clusterRoles?.find(item => item.RoleName === 'CodeZeroClusterRole')
        if (!codeZeroClusterRole) {
            debug('Creating CodeZeroClusterRole')
            codeZeroClusterRole = await this.createRole('CodeZeroClusterRole', this.eksClusterInlinePolicy())
        }
        debug('Attaching policies to CodeZeroClusterRole')
        await this.attachRolePolicy('CodeZeroClusterRole', (await this.getCustomPolicy()).Arn)
        await this.attachRolePolicy('CodeZeroClusterRole', 'arn:aws:iam::aws:policy/AmazonEKSClusterPolicy')
        return codeZeroClusterRole
    }

    getNodeRole = async (): Promise<any> => {
        const nodeRoles = await this.getRoles('ec2')
        let codeZeroNodeRole = nodeRoles?.find(item => item.RoleName === 'CodeZeroNodeRole')
        if (!codeZeroNodeRole) {
            debug('Creating CodeZeroNodeRole')
            codeZeroNodeRole = await this.createRole('CodeZeroNodeRole', this.ec2NodeGroupInlinePolicy())
        }
        debug('Attaching policies to CodeZeroNodeRole')
        await this.attachRolePolicy('CodeZeroNodeRole', (await this.getCustomPolicy()).Arn)
        await this.attachRolePolicy('CodeZeroNodeRole', 'arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy')
        await this.attachRolePolicy('CodeZeroNodeRole', 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly')
        await this.attachRolePolicy('CodeZeroNodeRole', 'arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy')
        return codeZeroNodeRole
    }
}
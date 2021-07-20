# Grafana provisioner

This is a simple Grafana provisioner.  Once you've created an app called "grafana", go ahead and install it.  When installing, you will need to choose your adminsitrator credentials.  Install into whatever namespace you like.

> Before you can test it out, be sure to address both known issues below first.

To test out Grafana once it's running in a cluster, browse to:
http://localhost:3000/ and enter your administrator credentials.  If you didn't supply any, use admin / admin.

Grafana configuration options:
https://grafana.com/docs/grafana/latest/installation/configuration/

## Known issues:

### Port forwarding (manual step for now)

``` bash
kubectl -n <namespace> port-forward service/grafana 3000:3000
```

### Sample provisioner config addendum

Once you've created an app called "grafana", be sure to modify the app's database entry in MongoDb with the following edits / insertions:

```
{
    ...
    "name" : "grafana",
    "namespace" : "grafana",
    ...
    "spec" : {
        "services" : {
            "grafana" : {
                "storage" : "1Gi",
                "adminUsername" : "",
                "adminPassword" : ""
            }
        }
    },
    "install" : {
        "path" : "/index.js",
        "stages" : [
            {
                "id" : "g-creds",
                "title" : "Credentials",
                "tag" : "grafana-credentials"
            }
        ]
    },
    "icon" : "PHN2ZyBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHdpZHRoPSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBkPSJtMTIyOS42IDMyOC42cy0uNyAyLjktMS42IDcuOGMtOC4zIDIuNC0xNi42IDQuNy0yNC45IDcuNC0xMS41IDMuNS0yMi44IDcuNy0zNC4zIDExLjgtMTEuMyA0LjQtMjIuOCA4LjgtMzQgMTMuOC0yMi42IDkuNy00NSAyMC42LTY2LjkgMzIuOS0yMS4yIDExLjktNDIuMSAyNS02Mi40IDM5LjItMi45LTEuNC01LjItMi40LTUuMi0yLjQtMjA3LjMtNzkuMi0zOTEuNCAxNi4xLTM5MS40IDE2LjEtMTYuOCAyMjAuNSA4Mi44IDM1OS41IDEwMi41IDM4NC43LTQuOSAxMy42LTkuNSAyNy40LTEzLjcgNDEuMy0xNS4zIDUwLTI2LjggMTAxLjMtMzMuOSAxNTQuMy0xIDcuNi0xLjkgMTUuMy0yLjggMjMtMTkxLjUgOTQuNi0yNDguMyAyODguNS0yNDguMyAyODguNSAxNTkuOSAxODMuOSAzNDYuMyAxOTUuMyAzNDYuMyAxOTUuMy4yLS4xLjMtLjMuNS0uNCAyMy43IDQyLjMgNTEuMSA4Mi42IDgyIDEyMC4xIDEyLjkgMTUuNyAyNi41IDMwLjkgNDAuNiA0NS42LTU4LjMgMTY2LjcgOC4yIDMwNS40IDguMiAzMDUuNCAxNzggNi43IDI5NC45LTc3LjkgMzE5LjUtOTcuNCAxNy43IDYgMzUuNyAxMS4zIDUzLjggMTYgNTQuNyAxNC4xIDExMC43IDIyLjQgMTY2LjcgMjQuOCAxNCAuNiAyOCAuOSA0MS45LjhoNi44bDQuNC0uMSA4LjgtLjMgOC43LS40LjIuM2M4My44IDExOS42IDIzMS4zIDEzNi41IDIzMS4zIDEzNi41IDEwNC45LTExMC42IDExMC45LTIyMC4zIDExMC45LTI0NHMwLS44IDAtMS42YzAtMi0uMS0zLjMtLjEtMy4zLS4xLTEuNy0uMS0zLjMtLjMtNS4xIDIyLTE1LjQgNDMtMzIgNjIuOS00OS44IDQyLTM4IDc4LjctODEuMiAxMDkuMS0xMjcuOSAyLjktNC40IDUuNy04LjggOC40LTEzLjMgMTE4LjcgNi44IDIwMi40LTczLjUgMjAyLjQtNzMuNS0xOS43LTEyMy43LTkwLjItMTg0LTEwNC45LTE5NS40cy0uNi0uNS0xLjUtMS4xYy0uOC0uNi0xLjQtMS0xLjQtMS0uNy0uNS0xLjYtMS4xLTIuNi0xLjcuNy03LjUgMS40LTE0LjkgMS44LTIyLjMuOS0xMy4zIDEuMi0yNi43IDEuMy0zOS45bC0uMS05LjktLjEtNXYtMi41YzAtMy40LS4xLTIuMS0uMS0zLjRsLS40LTguMy0uNi0xMS4yYy0uMi0zLjktLjUtNy4yLS44LTEwLjctLjMtMy40LS42LTYuOS0xLTEwLjNsLTEuMi0xMC4zLTEuNC0xMC4yYy0yLTEzLjYtNC42LTI3LjEtNy43LTQwLjQtMTIuNC01My4zLTMzLjItMTAzLjktNjAuNy0xNDkuNHMtNjEuNy04NS44LTEwMC4yLTExOS43Yy0zOC41LTM0LTgxLjctNjEuMy0xMjctODEuN3MtOTIuOS0zMy41LTE0MC4zLTM5LjVjLTIzLjctMy4xLTQ3LjMtNC4zLTcwLjctNGwtOC43LjItMi4yLjFjLS42IDAtMy4zLjEtMyAuMWwtMy42LjItOC43LjZjLTMuMy4yLTYuNy41LTkuNi44LTEyIDEuMi0yMy45IDIuOC0zNS43IDUtNDcgOC44LTkxLjQgMjUuOC0xMzAuNSA0OS4ycy03My4xIDUyLjctMTAwLjggODUuOWMtMjcuNiAzMy4xLTQ5LjEgNjkuOC02My45IDEwNy44cy0yMy4xIDc3LjItMjUuNCAxMTUuM2MtLjYgOS41LS44IDE5LS42IDI4LjQgMCAyLjMuMSA0LjcuMiA3bC4zIDcuNmMuMyA0LjYuNyA5LjEgMS4xIDEzLjYgMS45IDE5LjMgNS40IDM3LjggMTAuNiA1NS43IDEwLjMgMzUuNyAyNi45IDY4IDQ3LjMgOTUuNCAyMC40IDI3LjUgNDQuOCA1MC4yIDcwLjcgNjcuOXM1My42IDMwLjQgODEgMzguNWMyNy41IDguMSA1NC44IDExLjYgODAuNSAxMS41IDMuMiAwIDYuNC0uMSA5LjYtLjIgMS43IDAgMy40LS4yIDUuMS0uMmw1LjEtLjNjMi43LS4zIDUuNS0uNSA4LjItLjguNiAwIDEuNS0uMiAyLjMtLjNsMi41LS4zYzEuNy0uMiAzLjMtLjUgNS0uNyAzLjQtLjQgNi4zLTEuMSA5LjMtMS42IDMtLjYgNi0xLjIgOS0yIDUuOS0xLjMgMTEuNi0zLjEgMTcuMy00LjggMTEuMi0zLjcgMjEuNy04LjIgMzEuNS0xMy4yczE4LjgtMTAuNyAyNy4yLTE2LjZjMi40LTEuNyA0LjctMy41IDctNS4zIDktNyAxMC40LTIwLjIgMy4yLTI5LTYuMy03LjctMTcuMS05LjctMjUuNy00LjktMi4xIDEuMi00LjMgMi4zLTYuNSAzLjQtNy41IDMuNi0xNS4zIDctMjMuNiA5LjctOC4zIDIuNi0xNi45IDQuOC0yNS45IDYuNC00LjUuNi05IDEuMy0xMy42IDEuNy0yLjMuMy00LjYuNC03IC40LTIuMy4xLTQuOC4zLTYuOS4yLTIuMiAwLTQuNC0uMS02LjctLjEtMi44LS4xLTUuNi0uMy04LjQtLjQgMCAwLTEuNCAwLS4zLS4xbC0uOS0uMS0xLjktLjJjLTEuMy0uMS0yLjUtLjItMy44LS40LTIuNS0uMy01LS42LTcuNS0xLTIwLjEtMi44LTQwLjUtOC43LTYwLjEtMTcuNi0xOS43LTguOS0zOC41LTIxLjEtNTUuNS0zNi40LTE3LTE1LjItMzEuOC0zMy42LTQzLjQtNTQuNC0xMS42LTIwLjctMTkuNy00My44LTIzLjUtNjgtMS45LTEyLjEtMi43LTI0LjYtMi40LTM2LjguMi0zLjQuMy02LjcuNS0xMC4xIDAgLjkuMS0uNS4xLS42bC4xLTEuMi4yLTIuNWMuMS0xLjcuMy0zLjMuNS01IC43LTYuNiAxLjctMTMuMyAyLjktMTkuOCA5LjMtNTIuNyAzNS43LTEwNC4xIDc2LjUtMTQzLjIgMTAuMi05LjcgMjEuMi0xOC44IDMyLjktMjYuOHMyNC4yLTE1LjIgMzcuMi0yMS4yIDI2LjYtMTAuOSA0MC41LTE0LjdjMTMuOS0zLjcgMjguMi02LjIgNDIuNy03LjUgNy4yLS42IDE0LjUtLjkgMjEuOC0uOSAxLjkgMCAzLjQuMSA0LjkuMWw1LjkuMiAzLjcuMWMxLjUgMCAwIDAgLjcuMWwxLjUuMSA1LjkuNGMxNS43IDEuMyAzMS40IDMuNSA0Ni44IDcgMzAuOSA2LjkgNjAuOSAxOC4yIDg4LjkgMzMuNyA1NiAzMSAxMDMuNyA3OS41IDEzMyAxMzggMTQuOCAyOS4xIDI1IDYwLjUgMzAuMiA5Mi45IDEuMiA4LjEgMi4yIDE2LjMgMi45IDI0LjVsLjUgNi4yLjMgNi4yYy4xIDIuMS4xIDQuMS4yIDYuMiAwIDIgLjEgNC4zLjEgNS44djUuM2wtLjEgNmMtLjIgNC0uNSAxMC41LS43IDE0LjUtLjcgOC45LTEuNCAxNy45LTIuNiAyNi44LTEuMSA4LjgtMi42IDE3LjYtNC4yIDI2LjQtMS44IDguNy0zLjYgMTcuNC01LjkgMjYtNC4zIDE3LjMtOS45IDM0LjItMTYuNCA1MC44LTEzLjEgMzMuMi0zMC42IDY0LjctNTEuNyA5My44LTQyLjMgNTguMS0xMDAgMTA1LjYtMTY1LjYgMTM1LjQtMzIuOCAxNC44LTY3LjQgMjUuNy0xMDMgMzEuNi0xNy44IDMtMzUuOCA0LjgtNTMuOCA1LjRsLTMuMy4xaC0yLjlsLTUuOC4xaC04LjktNC40YzIuNSAwLS40IDAtLjMtLjFsLTEuOC0uMWMtOS43LS4yLTE5LjMtLjctMjguOS0xLjQtMzguNS0yLjktNzYuNi05LjctMTEzLjUtMjAuNS0zNi45LTEwLjctNzIuNy0yNS0xMDYuNi00My02Ny43LTM2LjItMTI4LjItODUuOC0xNzUuNi0xNDUuNi0yMy44LTI5LjgtNDQuNi02MS44LTYxLjgtOTUuNXMtMzAuNy02OS00MC43LTEwNS4xYy05LjktMzYuMS0xNi4xLTczLjEtMTguNS0xMTAuM2wtLjQtNy0uMS0xLjd2LTEuNWwtLjEtMy4xLS4yLTYuMS0uMS0xLjV2LTIuMS00LjNsLS4xLTguN3YtMS43YzAgLjMgMCAuMyAwLS42di0zLjRjMC00LjUuMi05LjEuMy0xMy42LjctMTguNCAyLjItMzcuMyA0LjYtNTYuMnM1LjUtMzcuOSA5LjQtNTYuOGMzLjktMTguOCA4LjUtMzcuNSAxMy43LTU1LjggMTAuNS0zNi43IDIzLjYtNzIuMyAzOS4xLTEwNS45IDMxLjEtNjcuMyA3MS45LTEyNi42IDEyMC45LTE3NC40IDEyLjItMTIgMjQuOS0yMy4zIDM4LjEtMzMuOXMyNi45LTIwLjQgNDEtMjkuNmMxNC05LjMgMjguNS0xNy43IDQzLjQtMjUuNSA3LjQtNCAxNS03LjUgMjIuNi0xMS4yIDMuOC0xLjcgNy43LTMuNCAxMS41LTUuMXM3LjctMy40IDExLjYtNC45YzE1LjUtNi42IDMxLjUtMTIuMSA0Ny41LTE3LjMgNC4xLTEuMiA4LjEtMi41IDEyLjEtMy43IDQtMS4zIDguMi0yLjIgMTIuMi0zLjQgOC4xLTIuMyAxNi40LTQuMiAyNC42LTYuMyA0LjEtMS4xIDguMy0xLjggMTIuNC0yLjcgNC4yLS45IDguMy0xLjggMTIuNS0yLjZzOC40LTEuNSAxMi41LTIuM2w2LjMtMS4xIDYuMy0xYzQuMi0uNiA4LjQtMS4zIDEyLjYtMS45IDQuNy0uOCA5LjUtMS4yIDE0LjItMS45IDMuOS0uNSAxMC4yLTEuMiAxNC4xLTEuNyAzLS4zIDUuOS0uNiA4LjktLjlsNS45LS42IDMtLjMgMy41LS4yYzQuOC0uMyA5LjUtLjYgMTQuMy0uOWw3LjEtLjVzMi42LS4xLjMtLjFsMS41LS4xIDMtLjFjNC4xLS4yIDguMS0uNCAxMi4yLS42IDE2LjItLjUgMzIuMy0uNSA0OC4yIDAgMzEuOSAxLjMgNjMuMiA0LjggOTMuNiAxMC40IDYwLjkgMTEuMyAxMTguMiAzMC45IDE3MCA1Ni41IDUxLjkgMjUuNCA5OC40IDU2LjYgMTM4LjggOTAuNSAyLjUgMi4xIDUgNC4zIDcuNSA2LjQgMi41IDIuMiA0LjkgNC4zIDcuMyA2LjUgNC45IDQuMyA5LjYgOC44IDE0LjMgMTMuMSA0LjcgNC40IDkuMiA4LjkgMTMuOCAxMy4zIDQuNCA0LjUgOC45IDguOSAxMy4yIDEzLjUgMTcuMSAxOC4xIDMzIDM2LjUgNDcuMyA1NSAyOC43IDM2LjkgNTEuNiA3NC4xIDY5LjkgMTA5LjMgMS4yIDIuMiAyLjMgNC40IDMuNCA2LjZzMi4yIDQuNCAzLjIgNi42YzIuMSA0LjMgNC4zIDguNiA2LjIgMTIuOSAyIDQuMyA0IDguNSA1LjkgMTIuNyAxLjggNC4yIDMuNiA4LjQgNS40IDEyLjQgNi44IDE2LjUgMTMgMzIuMSAxOC4xIDQ3IDguNCAyMy45IDE0LjUgNDUuNSAxOS4zIDY0LjIgMS45IDcuNSA5IDEyLjUgMTYuNyAxMS44IDgtLjcgMTQuMS03LjMgMTQuMy0xNS4zLjQtMjAuMS0uMS00My44LTIuNC03MC44LTMtMzMuNC04LjctNzIuMS0yMC0xMTQuNi0xMS4xLTQyLjUtMjcuNi04OS01MS42LTEzNy4zLTI0LjEtNDguMi01NS41LTk4LjQtOTYuMy0xNDYuOS0xNS45LTE5LTMzLjMtMzcuOC01Mi4xLTU2LjEgMjgtMTExLjQtMzQuMS0yMDgtMzQuMS0yMDgtMTA3LjItNi43LTE3NS40IDMzLjMtMjAwLjcgNTEuNi00LjItMS44LTguNS0zLjYtMTIuOC01LjQtMTguMy03LjQtMzctMTQuMy01Ni4zLTIwLjRzLTM5LTExLjctNTkuMS0xNi40Yy0yMC4yLTQuNy00MC43LTguNy02MS42LTExLjktMy43LS41LTcuMy0xLTExLTEuNi00Ni42LTE0OS40LTE4MC45LTIxMS45LTE4MC45LTIxMS45LTE0OS44IDk0LjUtMTc4LjMgMjI3LjQtMTc4LjMgMjI3LjQiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz48L2NsaXBQYXRoPjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIC0yNTUuNzc0MiAtMjU1Ljc3NDIgMCAyMDk5MTE1LjUgLTIwNzEzMy41NSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTgxOS43NjUwMSIgeDI9Ii04MTIuNjQ4NjgiIHkxPSI4MjAxLjcxIiB5Mj0iODIwMS43MSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmMjAwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjE1YTI5Ii8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBjbGlwLXBhdGg9InVybCgjYSkiIGQ9Im00MTIuNzAwMDEgMTAwLjhoMTgzNC40djE5OTIuM2gtMTgzNC40eiIgZmlsbD0idXJsKCNiKSIgdHJhbnNmb3JtPSJtYXRyaXgoLjAzMjEzMDEyNjAyIDAgMCAuMDMyMTMwMTI2MDIgLTEwLjcyNzA0MDE0MzY2IC0zLjI1MTU2ODg5NTc0KSIvPjwvc3ZnPg=="
}
```
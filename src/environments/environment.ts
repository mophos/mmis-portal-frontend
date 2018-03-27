// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  purchasingUrl: 'http://mmis.moph.go.th/purchasing',
  planningUrl: 'http://mmis.moph.go.th/planning',
  inventoryUrl: 'http://mmis.moph.go.th/inventory',
  materialsUrl: 'http://mmis.moph.go.th/inventory',
  reportUrl: 'http://mmis.moph.go.th/reports',
  umUrl: 'http://mmis.moph.go.th/um',
  contractsUrl: '/',
  apiUrl: 'http://localhost:3007',
  umLoginUrl: 'http://203.157.156.69/api/um'

};

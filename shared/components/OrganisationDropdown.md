### OrganisationDropdown with default values

```js
const { OrganisationDropdown } = require("components/OrganisationDropdown")
;<OrganisationDropdown
   organisations={[{oid: "123", nimi: {:fi "Test"}}]}
   onChange={console.log}
   value={"123"}
 />
```

### OrganisationDropdown with custom language

```js
const { OrganisationDropdown } = require("components/OrganisationDropdown")
;<OrganisationDropdown
   organisations={[{oid: "123", nimi: {:sv "De här test"}}]}
   onChange={console.log}
   value={"123"}
   lang="sv"
 />
```
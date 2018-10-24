## Planned study

```js
<StudyInfo
  accentColor="#EB6F02"
  fadedColor="#FDF1E6"
  title="Suunniteltu opinto"
  approved={null}
  learningEnvironments={["Opinpaikka", "Lähiopetus"]}
  period={[new Date("2018.05.24"), new Date("2018.05.31")]}
  competenceRequirements={["arvioida ja kehittää toimintaansa"]}
  assessment={[
    {
      "Tyydyttävä T1": [],
      "Tyydyttävä T2": [],
      "Hyvä H3": [],
      "Hyvä H4": [],
      "Kiitettävä K5": []
    }
  ]}
  width="50%"
/>
```

## Completed study

```js
<StudyInfo
  accentColor="#43A047"
  fadedColor="#ECF6ED"
  title="Valmis opinto"
  approved={new Date("2018.06.01")}
  learningEnvironments={["Opinpaikka", "Lähiopetus"]}
  period={[new Date("2018.05.24"), new Date("2018.05.31")]}
  competenceRequirements={["arvioida ja kehittää toimintaansa"]}
  assessment={[
    {
      "Tyydyttävä T1": [],
      "Tyydyttävä T2": [],
      "Hyvä H3": [],
      "Hyvä H4": [],
      "Kiitettävä K5": []
    }
  ]}
  width="50%"
/>
```

## Unscheduled study

```js
<StudyInfo
  accentColor="#E2A626"
  fadedColor="#FDF6E9"
  title="Aikatauluttamaton opinto"
  approved={null}
  learningEnvironments={[]}
  period={[]}
  competenceRequirements={["arvioida ja kehittää toimintaansa"]}
  assessment={[
    {
      "Tyydyttävä T1": [],
      "Tyydyttävä T2": [],
      "Hyvä H3": [],
      "Hyvä H4": [],
      "Kiitettävä K5": []
    }
  ]}
  width="50%"
/>
```

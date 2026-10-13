# React Hook Form demo

Een sign-up formulier dat in 6 stappen groeit: van een kaal `useForm()` tot zod-validatie met dynamische velden.
Elke stap is een eigen branch en voegt één idee toe.

| Branch                                         | Nieuw in deze stap                              |
|------------------------------------------------|-------------------------------------------------|
| `step/01-basic-form`                           | `useForm`, `register`, `handleSubmit`, `errors`, `useWatch` |
| `step/02-input-component`                      | herbruikbaar `Input` component                  |
| `step/03-validation-modes-default-values-reset`| `mode`, `defaultValues`, `reset()`              |
| `step/04-controller`                           | `Controller`                                    |
| `step/05-zod-validatie`                        | zod schema + `zodResolver`                      |
| `step/06-dynamische-velden`                    | `useFieldArray`, `setError`, `isSubmitting`     |

## Voorbereiding

```bash
npm install      # één keer: alle stappen hebben dezelfde dependencies
npm run dev
```

Wisselen tussen stappen terwijl `npm run dev` draait (Vite herlaadt vanzelf):

```bash
git switch step/02-input-component
```

Tonen wat er veranderd is ten opzichte van de vorige stap:

```bash
git diff step/01-basic-form step/02-input-component -- src
```

Open de browser-console: `App.tsx` logt in elke stap de waarde van *Email* via `useWatch`, bij elke render.
Dat is handig om te tonen wanneer het formulier opnieuw rendert.
Elke log verschijnt twee keer: dat is React StrictMode in dev, niet het formulier.

De zip-bestanden op `step/04-controller` zijn snapshots van elke stap, om uit te delen aan studenten.

---

## Stap 1: basisformulier

**Bestand:** `src/App.tsx`

**Uitleggen:**
- `useForm<SignUpFormValues>()`: de generic zorgt dat TypeScript de veldnamen kent.
  Typ `register("emial")` om de fout te tonen.
- `{...register("email", {...})}` geeft `name`, `ref`, `onChange` en `onBlur` aan de input.
  Het formulier is *uncontrolled*: geen `useState` per veld, dus geen re-render bij elke toetsaanslag.
- Het 2de argument van `register` bevat de validatieregels: `required`, `pattern`, `minLength`.
- `handleSubmit(onSubmit)` roept `onSubmit` alleen aan als alles geldig is.
- `noValidate` op `<form>` zet de browser-validatie uit, zodat je alleen de foutmeldingen van react-hook-form ziet.
- `useWatch({control, name: "email"})` leest één veld live mee. Alleen dat veld laat `App` opnieuw renderen.
  `control` koppelt hooks en componenten aan dit formulier; de `Controller` in stap 4 gebruikt het ook.
  (`watch("email")` doet hetzelfde, maar de React Compiler kan dat niet optimaliseren en ESLint waarschuwt ervoor.)

**Demo:**
1. Klik meteen op *Submit*: alle "required"-fouten verschijnen.
2. Typ een ongeldig e-mailadres en submit: "Invalid email".
3. Vul alles correct in: de data verschijnt bovenaan.
4. Typ in *First name*: geen log in de console. Typ in *Email*: een log per toets.

**Om op te wijzen:** de fouten verschijnen pas na de eerste submit. Dat is de standaard `mode: "onSubmit"`, zie stap 3.
Wachtwoord en bevestiging worden nog niet vergeleken, dat komt in stap 5.

## Stap 2: herbruikbaar Input component

**Bestanden:** `src/components/Input/Input.tsx`, `src/App.tsx`

**Uitleggen:**
- Elk veld in stap 1 was dezelfde `label` + `input` + foutmelding. Dat gaat nu in één component.
- De props zijn getypt met de types van react-hook-form:
  - `Path<SignUpFormValues>`: alleen bestaande veldnamen zijn toegelaten.
  - `UseFormRegister<SignUpFormValues>`: het type van `register`.
  - `RegisterOptions<SignUpFormValues>`: de validatieregels, hetzelfde object als in stap 1.
  - `FieldError`: de fout voor dit veld.
- `index.ts` is een barrel: `import {Input} from "./components/Input"`.

**Demo:** het formulier werkt precies als in stap 1, maar `App.tsx` is veel korter. Toon de diff.

## Stap 3: validatie-modes, default values en reset

**Bestand:** `src/App.tsx`

**Uitleggen:**
- `mode` bepaalt *wanneer* er gevalideerd wordt:
  `onSubmit` (standaard), `onBlur`, `onChange`, `onTouched` of `all`.
  Hier staat `onBlur`: een veld wordt gecontroleerd als je het verlaat.
- `defaultValues`: de beginwaarden van het formulier. `reset()` zet het formulier daarop terug.
  Geef voor elk veld een default (`""`) op: `reset()` weet dan waarnaar terug te gaan,
  en een `Controller` (stap 4) heeft een beginwaarde nodig.

**Demo:**
1. Klik in *First name* en tab weg: de fout verschijnt meteen, zonder submit.
2. Begin te typen: de fout verdwijnt. Na de eerste validatie wordt bij elke wijziging opnieuw gevalideerd (`reValidateMode`).
3. Vul wat velden in en klik *Reset*.
4. Zet `mode` live op `"onChange"` en toon het verschil.

## Stap 4: Controller

**Bestanden:** `src/components/ControlledSelect/ControlledSelect.tsx`, `src/App.tsx`

**Uitleggen:**
- `register` werkt alleen voor inputs die een `ref` aanvaarden en native events geven.
  Veel UI-libraries (MUI, React Select, date pickers) werken met `value` + `onChange` props: daarvoor heb je `Controller` nodig.
- `Controller` krijgt `control` (uit `useForm`, al gebruikt door `useWatch` sinds stap 1) en een `name`, en geeft via `render` een `field` object terug
  met `value`, `onChange`, `onBlur`, `name` en `ref`.
- Een gewone `<select>` kan eigenlijk ook met `register`. Hier is hij bewust als Controller gebouwd,
  zodat je het patroon ziet met een eenvoudig element.
- Nieuw veld `country` in de interface en in `defaultValues`. Omdat de Controller getypt is met `SignUpFormValues`,
  geeft TypeScript een fout als je dat vergeet.

**Demo:** kies een land, submit en toon in de console dat `country` in de data zit. Klik *Reset*: de select gaat terug naar "Choose".

## Stap 5: zod-validatie

**Bestanden:** `src/App.tsx`, `src/components/Input/Input.tsx`

**Uitleggen:**
- Alle validatieregels verhuizen naar één zod schema. De `rules` prop van `Input` verdwijnt (toon de diff).
- `resolver: zodResolver(signUpSchema)` laat react-hook-form valideren met het schema.
- `z.infer<typeof signUpSchema>` leidt het TypeScript type af uit het schema: de interface van stap 1–4 is niet meer nodig.
  Eén bron van waarheid voor validatie en types.
- Validatie over velden heen kan met `.refine()`: het wachtwoord moet gelijk zijn aan de bevestiging.
  Met `path: ["confirmPassword"]` komt de fout bij het juiste veld.
- E-mail: `.trim().toLowerCase()` past de waarde aan vóór de validatie.
  `.pipe(z.email(...))` controleert daarna het formaat. In zod 4 is `z.email()` de vervanger van het verouderde `z.string().email()`.
- Het schema wordt niet geëxporteerd: React Fast Refresh wil dat een componentbestand alleen componenten exporteert (types mogen wel).

**Demo:**
1. Vul twee verschillende wachtwoorden in: "The passwords do not match" bij *Confirm password*.
2. *First name* met minder dan 5 tekens geeft een fout.
3. Typ `  Jan@Example.COM ` als e-mail, submit: in de console staat `jan@example.com`.

## Stap 6: dynamische velden

**Bestanden:** `src/App.tsx`, `src/App.css`

**Uitleggen:**
- `useFieldArray({control, name: "addresses"})` geeft `fields`, `append` en `remove`.
- Gebruik `key={f.id}` en niet de index: react-hook-form maakt een stabiele id per rij, zodat verwijderen geen waarden door elkaar haalt.
- Geneste veldnamen zoals `` `addresses.${idx}.street` `` zijn ook een geldig `Path`, dus het `Input` component werkt hier gewoon.
- Het zod schema valideert de array: `z.array(z.object({...}))`.
- `setError` toont een fout die van de server komt bij het juiste veld.
  `fakeSignUp` simuleert een server-call van 500 ms die faalt voor `taken@example.com`.
- `onSubmit` is `async`: tijdens het wachten is `isSubmitting` `true`, en de knop is dan uitgeschakeld.

**Demo:**
1. Klik *Add address* een paar keer, laat velden leeg en submit: fouten per rij.
2. Verwijder een rij in het midden: de andere rijen behouden hun waarden.
3. Vul alles correct in met e-mail `taken@example.com`: de knop toont "Submitting...", daarna verschijnt "Email already taken".

---

**Niet gebruikt:** het script `npm run server` (json-server met `data/db.json`) zit in het project, maar geen enkele stap gebruikt het.

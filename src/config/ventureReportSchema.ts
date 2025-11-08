// Define the ventureReportSchema here: 
//
// defines how the json in the db should be read
// display dynamically changes using the schema
// so when there are form changes we don't have to perform db migration all the time
// the format is basically MUI props

export const ventureReportSchema = {
  version: '1.0',
  fields: [
    {
      name: 'health',
      label: 'Health',
      type: 'select',
      component: 'Select',
      required: true,
      options: [
        { value: 'on_track', label: 'On Track' },
        { value: 'at_risk', label: 'At Risk' },
        { value: 'blocked', label: 'Blocked' },
      ],
    },
    {
      name: 'changes_by_partner',
      label: 'Changes by Partner',
      type: 'textarea',
      component: 'TextField',
      multiline: true,
      rows: 4,
      required: true,
      helperText: 'Describe any changes requested or implemented by the partner',
    },
    {
      name: 'successes',
      label: 'Successes',
      type: 'textarea',
      component: 'TextField',
      multiline: true,
      required: true,
      rows: 4,
      helperText: 'What went well this period?',
    },
    {
      name: 'challenges',
      label: 'Challenges/Problems',
      type: 'textarea',
      component: 'TextField',
      multiline: true,
      rows: 4,
      helperText: "What has been difficult?",
    },
    {
      name: 'asks',
      label: 'Asks',
      type: 'text',
      component: 'TextField',
      multiline: true,
      rows: 4,
      helperText: "Is there anything the Cadre can assist with?",
    },
    {
      name: 'staffing_need',
      label: 'Staffing Needs',
      type: 'text',
      component: 'TextField',
    },
    {
      name: 'next_steps',
      label: 'Next Steps',
      type: 'textarea',
      component: 'TextField',
      multiline: true,
      rows: 4,
    },
  ]

  // when fields are switched/removed from the main venture report form,
  // move them down here for backwards compatibility
  //
  // depreciatedFields: [ { name: deprec_field_example, ... } ]
}

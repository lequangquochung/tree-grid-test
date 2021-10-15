export const DATA_COLUMNS = [
  {
    field: 'taskID',
    headerText: 'Task ID1',
    textAlign: 'Left',
    type: 'string',
    visible: false,
    isPrimaryKey: true,
    fontSize: 14,
    color: '#757575',
    textWrap: 'normal',
    minWidth: 150,
    showInColumnChooser: false,
    customAttributes: { class: 'header-column-font1' },
    backgroundColor: '#fff',
  },
  {
    field: 'taskCode',
    headerText: 'Task ID',
    textAlign: 'Left',
    type: 'string',
    allowEditing: false,

    minWidth: 150,
    fontSize: 14,
    color: '#757575',
    textWrap: 'normal',
    customAttributes: { class: 'header-column-font2' },
    backgroundColor: '#fff',
  },
  {
    field: 'taskName',
    headerText: 'Task Name',
    textAlign: 'Left',
    type: 'string',
    fontSize: 14,
    minWidth: 150,
    color: '#757575',
    textWrap: 'normal',
    customAttributes: { class: 'header-column-font3' },
    backgroundColor: '#fff',
  },
  {
    field: 'startDate',
    headerText: 'Start Date',
    textAlign: 'Left',
    format: 'MM/dd/yyyy',
    editType: 'datetimepickeredit',
    type: 'date',
    fontSize: 14,
    minWidth: 150,
    color: '#757575',
    textWrap: 'normal',
    customAttributes: { class: 'header-column-font4' },
    backgroundColor: '#fff',
  },
  {
    field: 'duration',
    headerText: 'Duration',
    textAlign: 'Left',
    type: 'number',
    fontSize: 14,
    minWidth: 150,
    color: '#757575',
    textWrap: 'normal',
    customAttributes: { class: 'header-column-font5' },
    backgroundColor: '#fff',
  },
];

var formTemplate = {
  "1": {
    "field_type": "submitter_info",
    "skip_validation": true,
    "view_only": {
      "question": "Submitter",
      "resource_method": "get_submitter_info"
    },
    "pdf_only": {
      "resource_method": "get_submitter_email"
    },
    "column": {
      "name": "Submitter",
      "resource_method": "get_submitter_info",
      "order": 1,
      "width": 35
    }
  },
  "3": {
    "field_type": "display_only",
    "skip_validation": true,
    "principal_person_type": "Principal Person",
    "form_only": {
      "question_css_classes": "always_required",
      "field_set_begin": "Principal Person Information"
    },
    "view_only": {
      "field_set_begin": "Principal Investigator"
    }
  },
  "4": {
    "question": "First Name:",
    "field_name": "first_name",
    "field_type": "text_field",
    "form_only": {
      "question_css_classes": "always_required",
      "input_field_css_classes": "require_field"
    },
    "validation": {
      "always_require": true,
      "validate_methods": [
        {
          "max_length": 255
        }
      ]
    },
    "column": {
      "order": 4,
      "name": "Principal Person First Name",
      "width": 20
    }
  },
  "5": {
    "question": "Middle Name:",
    "field_name": "middle_name",
    "field_type": "text_field",
    "form_only": {
      "question_css_classes": "always_required"
    },
    "validation": {
      "require": false,
      "validate_methods": [
        {
          "max_length": 255
        }
      ]
    },
    "column": {
      "order": 5,
      "name": "Principal Person Middle Name",
      "width": 20
    }
  },
  "6": {
    "question": "Last Name:",
    "field_name": "last_name",
    "field_type": "text_field",
    "form_only": {
      "question_css_classes": "always_required",
      "input_field_css_classes": "require_field"
    },
    "validation": {
      "always_require": true,
      "validate_methods": [
        {
          "max_length": 255
        }
      ]
    },
    "column": {
      "order": 6,
      "name": "Principal Person Last Name",
      "width": 20
    }
  },
  "7": {
    "question": "Email Address:",
    "field_name": "email",
    "field_type": "text_field",
    "form_only": {
      "question_css_classes": "always_required",
      "input_field_css_classes": "require_field",
      "field_text_note": {
        "message": "Email notifications regarding this application will be sent to the submitter and the Principal Investigator.",
        "position": "bottom",
        "css_classes": "field-text-note"
      }
    },
    "validation": {
      "always_require": true,
      "validate_methods": [
        {
          "max_length": 255
        },
        "form_builder_validate_email"
      ]
    },
    "column": {
      "order": 7,
      "name": "Principal Person Email Address",
      "width": 35
    }
  },
  "8": {
    "skip_validation": true,
    "form_only": {
      "display_partial": {
        "partial_name": "required_field_save",
        "locals": {
          "message": "Items in shaded area with a * are required for Save"
        }
      }
    }
  }
};
var questionTemplate = {
  field_type: '',
  skip_validation: false,
  form_only: {
    question_css_classes: '',
    input_field_css_classes: '',
    help_text: '',
    field_set_begin: ''
  },
  view_only: {},
  pdf_only: {},
  validation: {
    validation_methods: []
  },
  column: {
    width: 35
  }
};

var App = React.createClass({
  getInitialState: function() {
    return {
      form_type: {
        offering_cycle_id: 101,
        form_template_type_name: 'Application'
      },
      form: {}
    };
  },

  getNewKey: function() {
    var keys = Object.keys(this.state.form)
    if(keys.length > 0) {
      return Math.max.apply(null, keys) + 1;
    } else {
      return 1;
    }
  },

  addQuestion: function(data) {
    this.state.form[this.getNewKey()] = data;
    this.forceUpdate();
  },

  handleOfferingCycleChange: function(data) {
    this.state.form_type.offering_cycle_id = data;
    this.forceUpdate();
  },

  handleFormTypeChange: function(data) {
    var tmp = this.state.form_type;
    tmp.form_template_type_name = data;
    this.setState({ form_type: tmp });
  },

  importForm: function() {
    this.setState({ form: JSON.parse(JSON.stringify(formTemplate)) });
  },

  exportFile: function() {
    console.log(JSON.stringify(this.state, null, 4));

    $.ajax({
      url: '/api/export_file',
      dataType: 'text',
      type: 'POST',
      data: this.state,
      success: function(data) {
        console.log("Exported successfully!")
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    // var YAML = window.YAML
    // , json
    // , data
    // , yml
    // ;
    // var filename = 'offering_cycle_form.yml';
    // var text = YAML.stringify(this.state);
    // console.log(text);
    // var element = document.createElement('a');
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    // element.setAttribute('download', filename);
    //
    // element.style.display = 'none';
    // document.body.appendChild(element);
    //
    // element.click();
    //
    // document.body.removeChild(element);
  },

  render: function() {
    return (
      <div className='app'>
        <div id='offeringCycleForm' className='col-md-12'>
          <h2>Offering Cycle Information</h2>
          <OfferingCycleForm data={ this.state.form_type } handleImport={ this.importForm } handleFormTypeChange={ this.handleFormTypeChange } handleOfferingCycleChange={ this.handleOfferingCycleChange } />
        </div>
        <div id='questionList' className='col-md-8'>
          <h2>Form Specs</h2>
          <QuestionList data={ this.state.form } />
        </div>
        <div id='questionForm' className='col-md-4'>
          <h2>Add a Question</h2>
          <QuestionForm handleSubmit={ this.addQuestion } />
        </div>
        <div id='exportFile' className='col-md-12'>
          <div className='btn btn-primary col-md-2 col-md-offset-5' onClick={ this.exportFile }>
            Export YAML File
          </div>
        </div>
      </div>
    )
  }
});

var OfferingCycleForm = React.createClass({
  handleOfferingCycleChange: function(data) {
    this.props.handleOfferingCycleChange(data);
  },

  handleFormTypeChange: function(data) {
    this.props.handleFormTypeChange(data);
  },

  render: function() {
    return (
      <div>
        <div className='form-group col-md-4'>
          <label className='question-label'>Offering Cycle ID: </label>
          <TextField data={ { name: 'offering_cycle_id', value: this.props.data.offering_cycle_id } } callback={ this.handleOfferingCycleChange } />
        </div>
        <div className='form-group col-md-4'>
          <label className='question-label'>Form Template Type: </label>
          <TextField data={ { name: 'form_template_type_name', value: this.props.data.form_template_type_name } } callback={ this.handleFormTypeChange } />
        </div>
        <div className='form-group col-md-2 btn btn-primary' onClick={this.props.handleImport} >
          Import Grey Box
        </div>
      </div>
    )
  }
});

var Question = React.createClass({
  fieldType: function() {
    if(this.props.data.field_type) {
      return (
        <div className='question-field'>
          Field Type: { this.props.data.field_type }
        </div>
      );
    } else {
      return null;
    }
  },

  question: function() {
    if(this.props.data.question) {
      return (
        <div className='question-field'>
          Question: { this.props.data.question }
        </div>
      );
    } else {
      return null;
    }
  },

  shortName: function() {
    var column = this.props.data.column;
    if(column && column.name) {
      return (
        <div className='question-field'>
          Short Name: { column.name }
        </div>
      );
    } else {
      return null;
    }
  },

  options: function() {
    var formOnly = this.props.data.form_only;
    if(formOnly && formOnly.options) {
      return (
        <div className='question-field'>
          Options: { JSON.stringify(formOnly.options) }
        </div>
      );
    } else {
      return null;
    }
  },

  helpText: function() {
    var formOnly = this.props.data.form_only;
    if(formOnly && formOnly.help_text) {
      return (
        <div className='question-field'>
          Help Text: {formOnly.help_text}
        </div>
      );
    } else {
      return null;
    }
  },

  fieldSetBegin: function() {
    var formOnly = this.props.data.form_only;
    if(formOnly && formOnly.field_set_begin) {
      return (
        <div className='question-field'>
          Field Set: <strong>{formOnly.field_set_begin}</strong>
        </div>
      );
    } else {
      return null;
    }
  },

  message: function() {
    var formOnly = this.props.data.form_only;
    if(formOnly && formOnly.display_partial && formOnly.display_partial.locals && formOnly.display_partial.locals.message) {
      return (
        <div className='question-field'>
          Message: {formOnly.display_partial.locals.message}
        </div>
      );
    } else {
      return null;
    }
  },

  isGreyBox: function() {
    var formOnly = this.props.data.form_only;
    if(formOnly && ((formOnly.question_css_classes && formOnly.question_css_classes.indexOf('always_required') >= 0) || (formOnly.display_partial && formOnly.display_partial.partial_name === 'required_field_save'))) {
      return (
        <div className='question-field'>
          Grey Box: <input type='checkbox' checked='true' disabled='true'/>
        </div>
      );
    } else {
      return null;
    }
  },

  isRequired: function() {
    var formOnly = this.props.data.form_only;
    if(!this.props.data.skip_validation && !(formOnly && formOnly.validation && formOnly.validation.require === false)) {
      return (
        <div className='question-field'>
          Required: <input type='checkbox' checked='true' disabled='true'/>
        </div>
      );
    } else {
      return (
        <div className='question-field'>
          Required: <input type='checkbox' disabled='true'/>
        </div>
      );
    }
  },

  render: function() {
    return (
      <li className="question">
        { this.fieldSetBegin() }
        { this.fieldType() }
        { this.question() }
        { this.shortName() }
        { this.options() }
        { this.helpText() }
        { this.message() }
        { this.isGreyBox() }
        { this.isRequired() }
      </li>
    );
  }
});

var QuestionList = React.createClass({
  render: function() {
    var data = this.props.data;
    var questions = Object.keys(data).map(function(key, index) {
      if(data[key].column) {
        data[key].column.order = key;
      }
      return (
        <Question data={ data[key] } key={ index }/>
      )
    });

    return (
      <ul className='list-unstyled'>
        { questions }
      </ul>
    );
  }
});

var QuestionForm = React.createClass({
  getInitialState: function() {
    return JSON.parse(JSON.stringify(questionTemplate));
  },

  fieldType: function() {
    if(this.state.field_type != undefined) {
      return (
        <FieldType currentType={ this.state.field_type } callback={ this.handleFieldTypeChange } />
      );
    } else {
      return null;
    }
  },

  question: function() {
    if(this.state.question != undefined) {
      return (
        <QuestionText callback={ this.handleQuestionChange } />
      );
    } else {
      return null;
    }
  },

  shortName: function() {
    var column = this.state.column;
    if(column && this.state.question != undefined) {
      return (
        <ShortName value={ column.name } callback={ this.handleShortNameChange } />
      );
    } else {
      return null;
    }
  },

  helpText: function() {
    var formOnly = this.state.form_only;
    if(formOnly && formOnly.help_text != undefined) {
      return (
        <HelpText value={ formOnly.help_text } callback={ this.handleHelpTextChange } />
      );
    } else {
      return null;
    }
  },

  fieldSet: function() {
    var formOnly = this.state.form_only;
    if(formOnly && this.state.field_type == 'display_only') {
      return (
        <FieldSet value={ formOnly.field_set_begin } callback={ this.handleFieldSetChange } />
      );
    } else {
      return null;
    }
  },

  options: function() {
    var formOnly = this.state.form_only;
    if(formOnly && formOnly.options != undefined) {
      return (
        <Options initialValue={ formOnly.options } callback={ this.handleOptionsChange } />
      )
    } else {
      return null;
    }
  },

  isGreyBox: function() {
    var formOnly = this.state.form_only;
    if(formOnly && ((formOnly.question_css_classes && formOnly.question_css_classes.indexOf('always_required') >= 0) || (formOnly.display_partial && formOnly.display_partial.partial_name === 'required_field_save'))) {
      return (
        <div className='question-field'>
          Grey Box: <input type='checkbox' checked='true' disabled='true'/>
        </div>
      );
    } else {
      return null;
    }
  },

  isRequired: function() {
    var formOnly = this.state.form_only;
    if(!this.state.skip_validation && !(formOnly && formOnly.validation && formOnly.validation.require === false)) {
      return (
        <div className='question-field'>
          Required: <input type='checkbox' checked='true' disabled='true'/>
        </div>
      );
    } else {
      return (
        <div className='question-field'>
          Required: <input type='checkbox' disabled='true'/>
        </div>
      );
    }
  },

  handleHelpTextChange: function(helpText) {
    this.state.form_only.help_text = helpText;
    this.forceUpdate();
  },

  handleFieldTypeChange: function(fieldType) {
    this.state.field_type = fieldType;
    delete this.state['form_only']['options'];
    switch(fieldType) {
      case 'display_only':
        delete this.state['question'];
        delete this.state['field_name'];
        delete this.state['column']
        this.state.skip_validation = true;
        break;
      case 'select_field':
        this.state.form_only.options = [];
      case 'textarea_field':
      case 'text_field':
        if(this.state.question === undefined) {
          this.state.question = '';
        }
        if(this.state.column === undefined) {
          this.state.column = {
            name: this.state.question,
            order: 1,
            width: 35
          };
        }
        break;
      default:
        break;
    }
    this.forceUpdate();
  },

  handleShortNameChange: function(shortName) {
    this.state.column.name = shortName;
  },

  handleQuestionChange: function(questionText) {
    this.state.question = questionText;
    this.state.field_name = questionText.replace(/([-\s])/g,'_').replace(':','').toLowerCase();
    this.forceUpdate();
  },

  handleOptionsChange: function(options) {
    this.state.form_only.options = options;
    this.forceUpdate();
  },

  handleSubmit: function() {
    this.props.handleSubmit(this.state);
    this.state = JSON.parse(JSON.stringify(questionTemplate));
    this.forceUpdate();
  },

  render: function() {
    return (
      <form className="questionForm">
        { this.fieldType() }
        { this.fieldSet() }
        { this.question() }
        { this.shortName() }
        { this.options() }
        { this.helpText() }

        { this.isGreyBox() }
        { this.isRequired() }
        <div onClick={ this.handleSubmit } className='btn btn-default'>Add Question</div>
      </form>
    );
  }
});

var ShortName = React.createClass({
  fieldData: function() {
    return { name: 'column[name]', value: this.props.value }
  },

  render: function() {
    return (
      <div className='form-group'>
        <label className='question-label'>Short Name: </label>
        <TextField data={ this.fieldData() } callback={ this.props.callback } />
      </div>
    );
  }
});

var QuestionText = React.createClass({
  fieldData: function() {
    return { name: 'question', value: this.props.value }
  },

  render: function() {
    return (
      <div className='form-group'>
        <label className='question-label'>Question: </label>
        <TextField data={ this.fieldData() } callback={ this.props.callback } />
      </div>
    );
  }
});

var OptionList = React.createClass({
  render: function() {
    var createOption = function(option, index) {
      return <li key={index}>{option}</li>;
    };

    if (this.props.options != undefined){
      return <ul>{this.props.options.map(createOption)}</ul>;
    } else {
      return null;
    }
  }
});

var Options = React.createClass({
  getInitialState: function() {
    return {options: this.props.initialValue, currentOption: ''};
  },

  fieldData: function() {
    return { name: 'form_only[options][]', value: this.state.currentOption }
  },

  handleCurrentOption: function(data) {
    this.setState({currentOption: data});
  },

  handleAddOption: function() {
    var nextOptions = this.state.options.concat([this.state.currentOption]);
    this.setState({options: nextOptions, currentOption: ''});
    this.props.callback(nextOptions);
  },

  render: function() {
    return (
      <div id='OptionList'>
        <h4> Current Options </h4>
        <OptionList options={this.state.options} />
        <div className='form-group'>
          <TextField data={ this.fieldData() } callback={ this.handleCurrentOption } />
          <div className='btn btn-default' onClick={ this.handleAddOption } >Add Option</div>
        </div>
      </div>
    )
  }
});

var FieldType = React.createClass({
  fieldTypes: function() {
    return [
      { key: 'text_field', value: 'Text Field' },
      { key: 'textarea_field', value: 'Text Area' },
      { key: 'select_field', value: 'Dropdown Menu' },
      { key: 'display_only', value: 'Display Only' }
    ];
  },

  fieldData: function() {
    return { name: 'field_type', options: this.fieldTypes(), value: this.props.currentType };
  },

  render: function() {
    return (
      <div className='form-group'>
        <label className='question-label'>Field Type: </label>
        <SelectField data={ this.fieldData() } callback={ this.props.callback } />
      </div>
    );
  }
});

var HelpText = React.createClass({
  fieldData: function() {
    return { name: 'form_only[help_text]', value: this.props.value }
  },

  render: function() {
    return (
      <div className='form-group'>
        <label className='question-label'>Help Text: </label>
        <TextField data={ this.fieldData() } callback={ this.props.callback } />
      </div>
    );
  }
});

var FieldSet = React.createClass({
  fieldData: function() {
    return { name: 'form_only[field_set_begin]', value: this.props.value }
  },

  render: function() {
    return (
      <div className='form-group'>
        <label className='question-label'>Field Set Begin: </label>
        <TextField data={ this.fieldData() } callback={ this.props.callback } />
      </div>
    );
  }
});

var RequiredField = React.createClass({
  fieldData: function() {
    return { name: 'form_only[help_text]', value: this.props.value }
  },

  render: function() {
    return (
      <CheckBoxField />
    );
  }
});

var CheckBoxField = React.createClass({
  handleChange: function(e) {
    console.log(e.target.value)
    this.props.callback(e.target.value);
  },

  render: function() {
    return (
      <input type='checkbox' name={ this.props.data.name } checked={ this.props.data.value } onChange={ this.handleChange } />
    );
  }
});

var TextField = React.createClass({
  handleChange: function(e) {
    this.props.callback(e.target.value);
  },

  render: function() {
    return (
      <input type='text' name={ this.props.data.name } defaultValue={ this.props.data.value } onChange={ this.handleChange } value={this.props.data.value} />
    );
  }
});

var SelectField = React.createClass({
  handleChange: function(e) {
    this.props.callback(e.target.value);
  },

  render: function() {
    var optionNodes = this.props.data.options.map(function(option, index) {
      return (
        <option key={ index } value={ option.key }>
          { option.value }
        </option>
      );
    });

    return (
      <select name={this.props.data.name} defaultValue={this.props.data.value} onChange={this.handleChange}>
        <option value='' default>Select a field type</option>
        { optionNodes }
      </select>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);

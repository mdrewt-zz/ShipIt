var QuestionConstructor = function(data) {
  var question = data;
  if (question === undefined) {
    question = {
      field_type: '',
      skip_validation: false,
      form_only: {
        question_css_classes: '',
        input_field_css_classes: ''
      },
      view_only: {},
      pdf_only: {},
      validation: {
        validation_methods: []
      },
      column: {}
    };
  }

  return {
    getData: function() {
      // Return a copy of the data. This forces changes to occur through callbacks. (Hack)
      return JSON.parse(JSON.stringify(question));
    },
    updateFieldType: function(fieldType) {
      question['field_type'] = field_type;
      switch(fieldType) {
        case 'display_only':
          delete[question['question']];
          delete[question['field_name']];
          question[skip_validation] = true;
          break;
        case 'select_field':
          question['form_only']['options'] = [];
        case 'textarea_field':
        case 'text_field':
          if(question['question'] === undefined) {
            question['question'] = '';
          }
          break;
        default:
          break;
      }
    },
    updateQuestion: function(questionText) {
      question['question'] = questionText;
      if(question['column']['name'] === question['question'] || question['column']['name'] === '' || !question['column']['name']) {
        question['column']['name'] = questionText;
      }
      question['field_name'] = questionText.replace(/([-\s])/g,'_').replace(':','').toLowerCase();
    },
    updateRequired: function(isGreyBox, isRequired) {
      if(isGreyBox && isRequired) {
        question['form_only']['question_css_classes'] += ' always_required';
        question['form_only']['input_field_css_classes'] += ' require_field';
        question['validation']['always_require'] = true;
      } else if(isGreyBox) {
        question['form_only']['question_css_classes'] += ' always_required';
        question['validation']['require'] = false;
        question['form_only']['input_field_css_classes'] = question['form_only']['input_field_css_classes'].replace('require_field', '').trim();
        delete question['validation']['always_require'];
      } else if(isRequired) {
        question['validation']['require'] = true;
        question['form_only']['question_css_classes'] = question['form_only']['question_css_classes'].replace('always_required', '').trim();
        question['form_only']['input_field_css_classes'] = question['form_only']['input_field_css_classes'].replace('require_field', '').trim();
        delete question['validation']['always_require'];
      } else {
        question['validation']['require'] = false;
        question['form_only']['question_css_classes'] = question['form_only']['question_css_classes'].replace('always_required', '').trim();
        question['form_only']['input_field_css_classes'] = question['form_only']['input_field_css_classes'].replace('require_field', '').trim();
        delete question['validation']['always_require'];
      }
    },
    updateShortName: function(shortName) {
      question['column']['name'] = shortName;
    }
  }
};

var question1 = QuestionConstructor();

var SelectField = React.createClass({
  // getInitialState: function() {
  //   return {};
  // },
  handleChange: function(e) {
    this.props.callback(e.target.value);
  },
  render: function() {
    var optionNodes = this.props.data.options.map(function(option) {
      return (
        <option value={option.value}>
          {option.label}
        </option>
      );
    });

    return (
      <select name={this.props.data.name} value={this.state} onChange={this.handleChange}>
        {optionNodes}
      </select>
    );
  }
});

var FieldType = React.createClass({
  fieldTypes: function() {
    return [
      {key: 'text_field', value: 'Text Field'},
      {key: 'textarea_field', value: 'Text Area'},
      {key: 'select_field', value: 'Dropdown Menu'},
      {key: 'display_only', value: 'Display Only'}
    ];
  },
  fieldData: function() {
    return { name: 'field_type', options: fieldTypes };
  },
  handleChange: question1.updateFieldType,
  render: function() {
    return (
      <div className='form-group'>
        <label className='question-label'>Field Type</label>
        <SelectField data={this.fieldData()} callback={this.handleChange} />
      </div>
    );
  }
});

var QuestionForm = React.createClass({
  getInitialState: function() {
    return question1.getData();
  },
  render: function() {
    return (
      <form className="questionForm">
        <FieldType />
      </form>
    );
  }
});

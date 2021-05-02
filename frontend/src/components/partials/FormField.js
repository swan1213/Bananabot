import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import classNames from 'classnames';
import { graphql } from 'react-apollo';
import Select from 'react-select';
import Geosuggest from 'react-geosuggest';

class FormField extends Component {
	render() {
        const { field, label, type, placeholder, onChange, ...props } = this.props;

        const id = field.name;

        let input;
        switch (type) {
            case 'address':
                const selectHandler = (value) => {
                    console.log("selected a result", value);
                    field.onBlur(value);
                };
                const value = _.isObject(field.value) ? field.value.label : field.value;
                input = (
                    <Geosuggest
                        initialValue={value}
                        onBlur={field.onBlur}
                        types={['geocode']}
                        onSuggestSelect={selectHandler} />
                );
                break;
            case 'select':
                input = (
                    <select
                        id={id}
                        {...field}>
                        {_.map(props.options, (option) => {
                            return (<option value={option.value} key={option.value}>
                                {option.label}
                            </option>);
                        })}
                    </select>
                );
                break;
            case 'text':
            default:
                input = (
                    <input
                        label={label}
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        {...props}
                        {...field} />
                );
        }

        const hasError = field.error && field.touched;

        return (
            <div className={classNames(
                "form-group", "form-field",
                `field-${field.name}`, {"has-error": hasError})}>
                <label htmlFor={id}>{label}</label>
				{input}
                { hasError && (
                    <span className="help-block error">{ field.error }</span>
                ) }
            </div>
        );
    }
}

FormField.defaultProps = {
    submitFailed: false,
    type: 'text',
    placeholder: ""
};

export default FormField;

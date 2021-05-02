import React, { Component, PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import * as Blueprint from "@blueprintjs/core";
import history from '../../router/history'
import {reduxForm} from 'redux-form';
import classNames from 'classnames';

class KeywordInput extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		value: PropTypes.arrayOf(PropTypes.string).isRequired
	}
	constructor() {
		super()
		this.state = {
			wipKeyword: ''
		}
	}

	handleKeypress(e) {
		const { wipKeyword } = this.state
		const { value } = this.props
    if (e.key === 'Enter' && wipKeyword !== '' && !value.find(w => w === wipKeyword)) {
			this.props.onChange([...value, wipKeyword])
			this.setState({wipKeyword: ''})
		}
	}

	deleteKeyword(keyword) {
    const newKeywords = this.props.value.filter(w => w !== keyword)
		return () => this.props.onChange(newKeywords)
	}

	handleChange(e) {
		this.setState({wipKeyword: e.target.value})
	}

	render() {
		return (
			<div>
				<label className="pt-label">
					{this.props.label}
					<input className="pt-input" value={this.state.wipKeyword} onKeyPress={this.handleKeypress.bind(this)} onChange={this.handleChange.bind(this)} />
				</label>
				{this.props.value.map(k => (<Blueprint.Tag className='pt-round' style={{marginRight: 2}} key={k} onRemove={this.deleteKeyword(k).bind(this)}>{k}</Blueprint.Tag>))}
			</div>
		)
	}
}

class PageSelect extends Component {
	static propTypes = {
		accessToken: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired
	}

	constructor() {
		super()
		this.makeRequest = this.makeRequest.bind(this)
		this.state = {
			pages: []
		}
	}

  makeRequest(path, method, mergeParams, cb) {
    window.FB.api(path, method, {...mergeParams, access_token: this.props.accessToken}, (response) => {
      if (response.error) {
        console.log(response.error)
      }

      cb(response)
    })
  }

  getPages() {
    this.makeRequest('/me/accounts', 'get', {}, (response) => {
      if (response.data) {
        this.setState({pages: response.data})
      }
    })
  }

	handlePageSelect(e) {
		this.setState({pageId: e.target.value})
		this.props.onChange(e.target.value)
	}

  componentWillMount() {
    this.getPages()
  }

	render() {
		return (
			<div style={{marginBottom: 10}}>
				<div className="pt-select">
					<select defaultValue='' onChange={this.handlePageSelect.bind(this)} value={this.state.pageId}>
						<option value=''>Select a page</option>
						{this.state.pages.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
					</select>
				</div>
			</div>
		)
	}
}

class AdAccountSelect extends Component {
	static propTypes = {
		accessToken: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired
	}

	constructor() {
		super()
		this.makeRequest = this.makeRequest.bind(this)
		this.state = {
			accounts: []
		}
	}

  makeRequest(path, method, mergeParams, cb) {
    window.FB.api(path, method, {...mergeParams, access_token: this.props.accessToken}, (response) => {
      if (response.error) {
        console.log(response.error)
      }

      cb(response)
    })
  }

  getPages() {
    this.makeRequest('/me/adaccounts?fields=name', 'get', {}, (response) => {
      if (response.data) {
        this.setState({accounts: response.data})
      }
    })
  }


  componentWillMount() {
    this.getPages()
  }

	handleAdAccountSelect(e) {
		this.setState({adAccountId: e.target.value})
		this.props.onChange(e.target.value)
	}

	render() {
		return (
			<div style={{marginBottom: 10}}>
				<div className="pt-select">
					<select defaultValue='' onChange={this.handleAdAccountSelect.bind(this)} value={this.state.adAccountId}>
						<option value=''>Select an ad account</option>
						{this.state.accounts.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
					</select>
				</div>
			</div>
		)
	}
}

class NewCampaign extends Component {
	constructor() {
		super()
		this.makeRequest = this.makeRequest.bind(this)
		this.state = { targets: [] }
	}

	makeRequest(path, method, mergeParams, cb) {
    window.FB.api(path, method, {...mergeParams, access_token: this.props.me.profile.fbToken}, (response) => {
      if (response.error) {
        console.log(response.error)
      }

      cb(response)
    })
  }


	createCampaign(values, dispatch) {
    const { targetId, targetType, messageTemplate, firstLevelOnly, deduplicate, inclusionKeywords, exclusionKeywords, delay } = values
		return this.props.mutate({
			variables: {
				targetId, targetType, messageTemplate, deduplicate, delay, inclusionKeywords, exclusionKeywords, firstLevelOnly
			}
		}).then((data) => {
			const result = data.data.createOrUpdateCommentCampaign.result
			history.pushState({createdCampaignId: result.id}, '/')
		})
	}

	handlePageSelect(pageId) {
    this.setState({postId: undefined})
		this.makeRequest(`/${pageId}/posts`, 'get', {}, (response) => {
			if (response.data) {
				this.setState({targets: response.data.map(post => {
					return { id: post.id, title: post.message, type: 'post' }
				})})
			}
		})
	}

  handleAdAccountSelect(adAccountId) {
    this.setState({postId: undefined})
		this.makeRequest(`/${adAccountId}/adcreatives?fields=effective_object_story_id,body`, 'get', {}, (response) => {
			if (response.data) {
				this.setState({targets: response.data.map(creative => {
					return { id: creative.id, title: creative.body, type: 'ad' }
				})})
			}
		})
	}

	handlePostOrAdSelect(event) {
    this.setState({targets: []})
	}

	render() {
    const {
      loading,
      me,
      fields: {
        targetType, messageTemplate, delay, targetId, firstLevelOnly, deduplicate, exclusionKeywords, inclusionKeywords
      },
      handleSubmit: _handleSubmit
    } = this.props;
    const handleSubmit = _handleSubmit(this.createCampaign.bind(this))

		if (loading) {
			return (
				<p>Loading...</p>
			);
		}

		const fbToken = me.profile.fbToken
		const renderError = field =>  field.error && field.touched && ( <span className="help-block error">{ field.error }</span>)

    return (
      <form>
        <div style={{margin: 10}}>
          <h2>New Campaign:</h2>
          <div>
            <label className="pt-label">
              Message Template
              <input
                className={classNames('pt-input', { 'pt-intent-danger': messageTemplate.error && messageTemplate.touched })}
                {...messageTemplate} />
                {renderError(messageTemplate)}
            </label>
          </div>

          <div>
            <Blueprint.RadioGroup
              label="Are you creating a campaign for a post or an ad?"
              selectedValue={targetType.value}
              onChange={evt => {
                this.handlePostOrAdSelect(evt)
                targetType.onChange(evt)
              }}>
              <Blueprint.Radio value='post'>Post</Blueprint.Radio>
              <Blueprint.Radio value='ad'>Ad</Blueprint.Radio>
            </Blueprint.RadioGroup>
          </div>

          { targetType.value === 'post'
            ? <PageSelect accessToken={fbToken} onChange={this.handlePageSelect.bind(this)} />
            : <AdAccountSelect accessToken={fbToken} onChange={this.handleAdAccountSelect.bind(this)} /> }

          <div style={{marginBottom: 10}}>
            <div className={'pt-select'}>
              <select defaultValue='' {...targetId} >
                <option value=''>Select a post</option>
                {this.state.targets.map(t => (<option key={t.id} value={t.id}>{t.title}</option>))}
              </select>
              {renderError(targetId)}
            </div>
          </div>

          <div>
            <Blueprint.Switch {...firstLevelOnly} label="First Level Only?" />
          </div>

          <div>
            <Blueprint.Switch {...deduplicate} label="Deduplicate?" />
          </div>

          <div>
            <label className="pt-label">
              Delay (in seconds)
              <input className="pt-input" type='number' {...delay} />
              {renderError(delay)}
            </label>
          </div>

          <KeywordInput label="Message Inclusion" {...inclusionKeywords} />
          <KeywordInput label="Message exclusion" {...exclusionKeywords} />

          <div>
            <button className="pt-button pt-icon-add" onClick={handleSubmit}>Create Campaign</button>
          </div>
        </div>
      </form>
    )
	}
}


const CampaignsMutation = gql`
  mutation createCampaign($messageTemplate: String!, $targetId: String!, $deduplicate: Boolean!, $firstLevelOnly: Boolean!, $exclusionKeywords: [String!], $inclusionKeywords: [String!], $delay: Int!, $targetType: String!) {
    createOrUpdateCommentCampaign(input: {
			messageTemplate: $messageTemplate,
			targetId: $targetId,
			targetType: $targetType
			deduplicate: $deduplicate,
			firstLevelOnly: $firstLevelOnly,
			inclusionKeywords: $inclusionKeywords,
			exclusionKeywords: $exclusionKeywords,
			delay: $delay
		}) {
			ok
			result {
				id
			}
		}
  }
`
const NewCampaignQuery = gql`query NewCampaign { me { profile { fbToken } } }`


const NewCampaignWithData = compose(
	graphql(CampaignsMutation),
	graphql(NewCampaignQuery, {props: ({ownProps, data}) => {
		return data
	}})
)(NewCampaign)

const NewCampaignWithForm = reduxForm({
	form: 'new-campaign',
	fields: ['targetType', 'messageTemplate', 'targetId', 'deduplicate', 'firstLevelOnly', 'exclusionKeywords', 'inclusionKeywords', 'delay'],
	validate: (values) => {
		const errors = {}
		if (!values.messageTemplate) {
			errors.messageTemplate = 'Please include a message template'
		}
		if (!values.targetId) {
			errors.targetId = 'Please select a post'
		}
		if (!values.delay && values.delay !== 0) {
			errors.delay = 'Please enter a valid delay value (can be 0)'
		}
    if (Object.keys(errors).length > 0) {
      console.log(errors)
    } else {
      console.log('no errors')
    }
		return errors
	},
	initialValues: {
		targetId: '',
		messageTemplate: '',
		inclusionKeywords: [],
		exclusionKeywords: [],
		targetType: 'post',
		deduplicate: false,
		firstLevelOnly: false,
		delay: 0
	}
})(NewCampaignWithData)

export default NewCampaignWithForm


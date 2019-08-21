import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import './XSuggest.scss'

export default class XSuggest extends React.Component {

    static TAGID = 0

    constructor(props) {
        super(props)

        const { datasets } = this.props
        this.state = {
            items: datasets,
            tags: [],
            selects: [],
            selectIds: [],
            keyword: ''
        }
    }

    tagName = 'virtual'


    updateItems(keyword = '') {
        const { datasets, idName, labelName } = this.props
        const { tags, selectIds } = this.state
        const itemsets = datasets.concat(tags)

        this.setState({
            items: itemsets.filter(u => selectIds.indexOf(u[idName]) === -1 && u[labelName].includes(keyword)),
            keyword
        })
    }


    buildTag(value) {
        if (!(value || '').length) { return null }

        const { datasets, idName, labelName } = this.props
        const { tags } = this.state
        const itemsets = datasets.concat(tags)
        let tag = itemsets.find(u => u[labelName] === value)

        if (!tag) {
            tag = {
                [this.tagName]: true,
                [idName]: `virtial${XSuggest.TAGID++}`,
                [labelName]: value
            }
        }

        return tag
    }

    pushTag(tag) {
        const { tags } = this.state

        if ((tag || {}).hasOwnProperty(this.tagName) && tag[this.tagName]) {
            tags.push(tag)
        }

        return tags
    }

    spliceTag(tag) {
        const { idName } = this.props
        const { tags } = this.state

        if ((tag || {}).hasOwnProperty(this.tagName) && tag[this.tagName]) {
            const index = tags.findIndex(u => u[idName] === tag[idName])

            if (index > -1) {
                tags.splice(index, 1)
            }
        }

        return tags
    }


    handleChange(keyword) {
        this.updateItems(keyword)
    }

    handleSelect(item) {
        const { multiple, tag, idName, onAdd, onChange } = this.props
        const { tags, selects, selectIds } = this.state

        if (!multiple) {
            const tag = selects.splice(0, 1)
            selectIds.splice(0, 1)

            tag && this.spliceTag(tag[0])
        }

        selects.push(item)
        selectIds.push(item[idName])

        this.setState({
            tags: tag ? this.pushTag(item) : tags,
            selects,
            selectIds
        }, () => this.updateItems(''))

        onAdd.call(this, item)
        onChange.call(this, selects, [item], null)
    }

    handleDelete(index, item = null) {
        const { tag, onRemove, onChange } = this.props
        const { keyword } = this.state
        const { tags, selects, selectIds } = this.state
        item = item || selects[index]

        selects.splice(index, 1)
        selectIds.splice(index, 1)

        this.setState({
            tags: tag ? this.spliceTag(item) : tags,
            selects,
            selectIds
        }, () => this.updateItems(keyword))

        onRemove.call(this, item)
        onChange.call(this, selects, null, [item])
    }

    handleKeyDown(event) {
        event.stopPropagation()

        const keyCode = event.which || event.keyCode
        const { selectionStart, value } = event.target

        if (keyCode === 8) {
            const { selects } = this.state
            const index = selects.length - 1

            if (index > -1 && selectionStart === 0) {
                this.handleDelete(index, selects[index])
            }
        } else if (keyCode === 13) {
            const { tag } = this.props

            if (tag && (value || '').length) {
                const tag = this.buildTag(value)

                this.handleSelect(tag)
            }
        }
    }


    render() {
        const { className, placeholder, idName, labelName, avatarName } = this.props
        const { items, selects, keyword } = this.state

        return (
            <div className={`form-control XSuggest ${className || ''}`}>
                {selects.map((item, index) => {
                    return (
                        <div key={`xsuggest-selected-${index}`} className="chip XSuggest-Item">
                            {
                                item[avatarName]
                                    ? <img src={item[avatarName]} alt={item[labelName]} className="chip-avatar chip-avatar-img" />
                                    : (
                                        <label title={item[labelName]} className="chip-avatar chip-avatar-label">
                                            {item[labelName][0].toUpperCase()}
                                        </label>
                                    )
                            }
                            <span>{item[labelName]}</span>
                            <span className="chip-close" onClick={() => this.handleDelete(index, item)}>&times;</span>
                        </div>
                    )
                })}

                <Autocomplete
                    value={keyword}
                    items={items}
                    autoHighlight={false}
                    wrapperProps={{ className: 'XSuggest-Input' }}
                    inputProps={{
                        placeholder: selects.length ? '' : placeholder,
                        onKeyDown: e => this.handleKeyDown(e)
                    }}
                    renderInput={props => <input
                        {...props}
                        autoComplete="new-password"
                    />}
                    renderMenu={items => <div className="list-unstyled" children={items} />}
                    renderItem={item => {
                        return (
                            <div key={`xsuggest-id-${item[idName]}`} className="media">
                                {
                                    item[avatarName]
                                        ? <img src={item[avatarName]} alt={item[labelName]} className="media-avatar media-avatar-img" />
                                        : (
                                            <label title={item[labelName]} className="media-avatar media-avatar-label">
                                                {item[labelName][0].toUpperCase()}
                                            </label>
                                        )
                                }
                                <div className="media-body">{item[labelName]}</div>
                            </div>
                        )
                    }}
                    getItemValue={item => item}
                    onChange={e => this.handleChange(e.target.value)}
                    onSelect={item => this.handleSelect(item)}
                />
            </div>
        )
    }
}

XSuggest.propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,

    datasets: PropTypes.array,
    selects: PropTypes.array,
    multiple: PropTypes.bool,
    tag: PropTypes.bool,
    idName: PropTypes.string,
    labelName: PropTypes.string,
    avatarName: PropTypes.string,

    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func
}

XSuggest.defaultProps = {
    className: null,
    placeholder: 'Enter keyword here ...',

    datasets: [],
    selects: [],
    multiple: false,
    tag: true,
    idName: 'id',
    labelName: 'label',
    avatarName: 'avatar',

    onAdd: function (item) { },
    onRemove: function (item) { },
    onChange: function (selects, adds, removes) { }
}
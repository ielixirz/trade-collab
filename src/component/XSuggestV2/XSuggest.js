import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import './XSuggest.scss'

export default class XSuggest extends React.Component {
    constructor(props) {
        super(props)

        const { datasets } = this.props
        this.state = {
            items: datasets,
            selects: [],
            selectIds: [],
            keyword: ''
        }
    }


    updateItems(keyword = '') {
        const { datasets, idName, labelName } = this.props
        const { selectIds } = this.state

        this.setState({
            items: datasets.filter(u => selectIds.indexOf(u[idName]) === -1 && u[labelName].includes(keyword)),
            keyword
        })
    }


    handleChange(keyword) {
        this.updateItems(keyword)
    }

    handleSelect(item) {
        const { multiple, idName, onAdd, onChange } = this.props
        const { selects, selectIds } = this.state

        if (!multiple) {
            selects.pop()
            selectIds.pop()
        }

        selects.push(item)
        selectIds.push(item[idName])

        this.setState({ selects, selectIds }, () => this.updateItems(''))

        onAdd.call(this, item)
        onChange.call(this, selects, [item], null)
    }

    handleDelete(index, item = null) {
        const { onRemove, onChange } = this.props
        const { selects, selectIds, keyword } = this.state
        item = item || selects[index]

        selects.splice(index, 1)
        selectIds.splice(index, 1)

        this.setState({ selects, selectIds }, () => this.updateItems(keyword))

        onRemove.call(this, item)
        onChange.call(this, selects, null, [item])
    }

    handleKeyDown(keyCode, cursorPosition) {
        const { selects } = this.state
        const index = selects.length - 1

        if (index > -1 && keyCode === 8 && cursorPosition === 0) {
            this.handleDelete(index, selects[index])
        }
    }


    render() {
        const { className, placeholder, multiple, idName, labelName, avatarName } = this.props
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
                            {
                                multiple
                                    ? <span className="chip-close" onClick={() => this.handleDelete(index, item)}>&times;</span>
                                    : <></>
                            }
                        </div>
                    )
                })}

                <Autocomplete
                    value={keyword}
                    items={items}
                    autoHighlight={false}
                    wrapperProps={{ className: 'XSuggest-Input' }}
                    inputProps={{ 
                        placeholder: multiple || !selects.length ? placeholder : '',
                        onKeyDown: e => this.handleKeyDown(e.which, e.target.selectionStart)
                    }}
                    renderInput={props => <input {...props} autoComplete="new-password" />}
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
    idName: 'id',
    labelName: 'label',
    avatarName: 'avatar',

    onAdd: function (item) { },
    onRemove: function (item) { },
    onChange: function (selects, adds, removes) { }
}
import React from 'react'
import PropTypes from 'prop-types'

export default class XCalendarClear extends React.Component {
    render() {
        const { className, visible, buttonProps } = this.props

        return (
            <div className={`XCalendar-Input--clear ${className} ${visible ? 'visible' : ''}`.trim()}>
                <button className="btn btn-outline-secondary" type="button" {...buttonProps}>&times;</button>
            </div>
        )
    }
}

XCalendarClear.propTypes = {
    className: PropTypes.string,
    visible: PropTypes.bool,
    buttonProps: PropTypes.object
}

XCalendarClear.defaultProps = {
    className: '',
    visible: false,
    buttonProps: {}
}
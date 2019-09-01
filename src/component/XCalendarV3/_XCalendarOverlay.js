/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { formatDate } from 'react-day-picker/moment'

export default class XCalendarOverlay extends React.Component {
    getDays(emptyVal = 0) {
        const { selectedDay } = this.props
        const { from, to } = (selectedDay || []).length > 1 ? selectedDay[1] : {}

        if (from && to) {
            return moment(to).startOf('day').diff(moment(from).startOf('day'), 'days') + 1;
        }

        return emptyVal
    }

    render() {
        const { classNames, children, selectedDay, ...props } = this.props
        const { from, to } = (selectedDay || []).length > 1 ? selectedDay[1] : {}
        const { format, tbaLabel, onTbaClick } = children.props

        return (
            <div className={classNames.overlayWrapper} {...props}>
                <div className={classNames.overlay}>
                    {children}

                    <hr className="mx-auto my-3" style={{ width: '95%' }} />

                    {from && to && (
                        <p className="text-center mb-0">
                            {formatDate(from, format)} - {formatDate(to, format)}&nbsp;
                            <strong>({this.getDays()} days)</strong>
                        </p>
                    )}

                    <p className="text-center">
                        <a
                            href="javascript:void(0)"
                            className="XCalendar-TBA"
                            onClick={e => onTbaClick(e)}
                        >
                            {tbaLabel}
                        </a>
                    </p>
                </div>
            </div>
        )
    }
}

XCalendarOverlay.propTypes = {
    classNames: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
}
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import PropTypes from 'prop-types'

export default class XCalendarOverlay extends React.Component {
    render() {
        const { classNames, children, selectedDay, ...props } = this.props
        const { tbaLabel, onTbaClick } = children.props

        return (
            <div className={classNames.overlayWrapper}{...props}>
                <div className={classNames.overlay}>
                    {children}

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
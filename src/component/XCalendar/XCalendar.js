import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { formatDate, parseDate } from 'react-day-picker/moment'
import XCalendarOverlay from './_XCalendarOverlay'

import 'react-day-picker/lib/style.css'
import './XCalendar.scss'

export default class XCalendar extends React.Component {
    constructor(props) {
        super(props)

        const { placeholder, format, start, end, tbaValue } = this.props

        this.handleFromChange = this.handleFromChange.bind(this)
        this.handleToChange = this.handleToChange.bind(this)

        this.state = {
            from: typeof start === 'number' ? moment.unix(start).toDate() : undefined,
            fromFormat: format,
            fromHint: start === tbaValue ? tbaValue : placeholder,
            to: typeof end === 'number' ? moment.unix(end).toDate() : undefined,
            toFormat: format,
            toHint: end === tbaValue ? tbaValue : placeholder
        }
    }

    $fromInput = null
    $toInput = null


    focusMonth() {
        const { from, to } = this.state
        const $fromPicker = this.$fromInput.getDayPicker()
        const $toPicker = this.$toInput.getDayPicker()

        if (from) {
            $fromPicker && $fromPicker.showMonth(from)

            if (to) {
                $toPicker && $toPicker.showMonth(moment(to).diff(moment(from), 'months') < 3 ? from : to)
            }
        }
    }


    handleFocus(period, format, callback = null) {
        const { tbaValue } = this.props
        const periodHint = this.state[`${period}Hint`]
        const periodDate = this.state[period]

        this.setState({
            [`${period}Format`]: format,
            [`${period}Hint`]: periodHint === tbaValue && !periodDate ? periodHint : format
        }, callback)
    }

    handleFocusIn(period) {
        this.handleFocus(period, 'DD/MM/YYYY', this.focusMonth)
    }

    handleFocusOut(period) {
        this.handleFocus(period, 'DD MMMM YYYY')
    }


    handleChange(period, date) {
        this.setState({ [period]: date }, this.focusMonth)
    }

    handleFromChange(date) {
        const { onStartChange } = this.props
        const { to } = this.state
        const toDate = to ? moment(to) : null
        const fromDate = date ? moment(date) : null
        let time = null

        if (fromDate) {
            time = fromDate.unix()

            if (toDate && fromDate.isAfter(toDate)) {
                date = toDate.toDate()
                time = toDate.unix()

            }
        }

        this.handleChange('from', date)

        onStartChange.call(this, time)
    }

    handleToChange(date) {
        const { onEndChange } = this.props
        const { from } = this.state
        const fromDate = from ? moment(from) : null
        const toDate = date ? moment(date) : null
        let time = null

        if (toDate) {
            time = toDate.unix()

            if (fromDate && toDate.isBefore(fromDate)) {
                date = fromDate.toDate()
                time = fromDate.unix()

            }
        }

        this.handleChange('to', date)

        onEndChange.call(this, time)
    }


    handleTba(period) {
        const { tbaValue } = this.props

        this.setState({
            [period]: undefined,
            [`${period}Hint`]: tbaValue
        })
    }

    handleFromTba() {
        const { onStartChange, tbaValue } = this.props

        this.handleTba('from')

        onStartChange.call(this, tbaValue)
    }

    handleToTba() {
        const { onEndChange, tbaValue } = this.props

        this.handleTba('to')

        onEndChange.call(this, tbaValue)
    }


    render() {
        const { startLabel, endLabel, tbaLabel } = this.props
        const { fromHint, from, fromFormat, toHint, to, toFormat } = this.state
        const modifiers = {
            start: from,
            end: to
        }

        return (
            <div className="XCalendar">
                <div className="form-row">

                    <div className="col-sm">
                        <div className="input-group XCalendar-From">
                            <div className="input-group-prepend">
                                <div className="input-group-text">{startLabel}</div>
                            </div>

                            <div className="XCalendar-Input">
                                <DayPickerInput
                                    ref={$el => (this.$fromInput = $el)}
                                    value={from ? moment(from, fromFormat).toDate() : ''}
                                    placeholder={fromHint}
                                    format={fromFormat}
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    hideOnDayClick={false}
                                    overlayComponent={XCalendarOverlay}
                                    inputProps={{
                                        className: 'form-control XCalendar-Input--input',
                                        onClick: () => this.handleFocusIn('from'),
                                        onBlur: () => this.handleFocusOut('from')
                                    }}
                                    dayPickerProps={{
                                        modifiers,
                                        numberOfMonths: 2,
                                        selectedDays: [from, { from, to }],
                                        disabledDays: { after: to },
                                        toMonth: to,
                                        tbaLabel: tbaLabel,
                                        onDayClick: () => this.$toInput.getInput().focus(),
                                        onTbaClick: () => this.handleFromTba()
                                    }}
                                    onDayChange={this.handleFromChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm">
                        <div className="input-group XCalendar-To">
                            <div className="input-group-prepend">
                                <div className="input-group-text">{endLabel}</div>
                            </div>

                            <div className="XCalendar-Input">
                                <DayPickerInput
                                    ref={$el => (this.$toInput = $el)}
                                    value={to ? moment(to, toFormat).toDate() : ''}
                                    placeholder={toHint}
                                    format={toFormat}
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    hideOnDayClick={false}
                                    overlayComponent={XCalendarOverlay}
                                    inputProps={{
                                        className: 'form-control XCalendar-Input--input',
                                        onClick: () => this.handleFocusIn('to'),
                                        onBlur: () => this.handleFocusOut('to')
                                    }}
                                    dayPickerProps={{
                                        modifiers,
                                        numberOfMonths: 2,
                                        selectedDays: [from, { from, to }],
                                        disabledDays: { before: from },
                                        month: from,
                                        fromMonth: from,
                                        tbaLabel: tbaLabel,
                                        onTbaClick: () => this.handleToTba()
                                    }}
                                    onDayChange={this.handleToChange}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

XCalendar.propTypes = {
    format: PropTypes.string,
    placeholder: PropTypes.string,

    startLabel: PropTypes.string,
    start: PropTypes.any,
    onStartChange: PropTypes.func,

    endLabel: PropTypes.string,
    end: PropTypes.any,
    onEndChange: PropTypes.func,

    tbaValue: PropTypes.any,
    tbaLabel: PropTypes.any
}

XCalendar.defaultProps = {
    format: 'DD MMMM YYYY',
    placeholder: 'DD/MM/YYYY',

    startLabel: 'From',
    start: undefined,
    onStartChange: function (value) { },

    endLabel: 'To',
    end: undefined,
    onEndChange: function (value) { },

    tbaValue: 'TBA',
    tbaLabel: `I'm not sure - date to be advised`
}
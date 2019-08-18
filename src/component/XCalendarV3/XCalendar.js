import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { formatDate, parseDate } from 'react-day-picker/moment'
import InputMask from 'react-input-mask'
import XCalendarOverlay from './_XCalendarOverlay'

import 'react-day-picker/lib/style.css'
import './XCalendar.scss'

export default class XCalendar extends React.Component {
    constructor(props) {
        super(props)

        const { format, placeholder, start, end, tbaValue } = this.props
        const state = {
            from: undefined,
            fromValue: '',
            fromHint: placeholder,
            fromFocus: false,
            fromValid: true,
            to: undefined,
            toValue: '',
            toHint: placeholder,
            toFocus: false,
            toValid: true
        }

        if (start) {
            if (start === tbaValue) {
                state.fromHint = tbaValue
            } else {
                const date = moment(start, format)

                if (date.isValid()) {
                    state.from = date.toDate()
                    state.fromValue = date.format(this.inputFormat)
                }
            }
        }

        if (end) {
            if (end === tbaValue) {
                state.toHint = tbaValue
            } else {
                const date = moment(end, format)

                if (date.isValid()) {
                    state.to = date.toDate()
                    state.toValue = date.format(this.inputFormat)
                }
            }
        }


        this.handleFromChange = this.handleFromChange.bind(this)
        this.handleToChange = this.handleToChange.bind(this)
        this.state = state
    }

    inputFormat = 'DD/MM/YYYY'
    inputMask = '99/99/9999'
    inputMaskChar = '_'

    $fromInput = null
    $fromMask = null
    $toInput = null
    $toMask = null


    containsMask(value) {
        return typeof value === 'string' && (new RegExp(this.inputMaskChar, 'g')).test(value)
    }

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


    handleFromFocus(focus) {
        const { placeholder, tbaValue } = this.props
        const { from, fromHint } = this.state

        this.setState({
            fromHint: fromHint === tbaValue && !from ? tbaValue : placeholder,
            fromFocus: focus
        })
    }

    handleFromChange(value) {
        value = value instanceof Date ? formatDate(value, this.inputFormat) : value

        const { format, onStartChange } = this.props
        let date = null
        let valid = true
        let output = null

        if (!this.containsMask(value)) {
            const { to } = this.state
            const toDate = to ? moment(to) : null
            let fromDate = moment(value, this.inputFormat)

            if (fromDate.isValid()) {
                if (toDate && fromDate.isAfter(toDate)) {
                    valid = false
                } else {
                    date = fromDate.toDate()
                    output = fromDate.format(format)
                }
            }
        }

        this.setState({
            from: date || undefined,
            fromValue: value,
            fromValid: valid
        }, this.focusMonth)

        onStartChange.call(this, output)
    }

    handleFromTba() {
        const { onStartChange, tbaValue } = this.props

        this.setState({
            from: undefined,
            fromValue: '',
            fromHint: tbaValue
        })

        onStartChange.call(this, tbaValue)
    }


    handleToFocus(focus) {
        const { placeholder, tbaValue } = this.props
        const { to, toHint } = this.state

        this.setState({
            toHint: toHint === tbaValue && !to ? tbaValue : placeholder,
            toFocus: focus
        })
    }

    handleToChange(value) {
        value = value instanceof Date ? formatDate(value, this.inputFormat) : value

        const { format, onEndChange } = this.props
        let date = null
        let valid = true
        let output = null

        if (!this.containsMask(value)) {
            const { from } = this.state
            const fromDate = from ? moment(from) : null
            let toDate = moment(value, this.inputFormat)

            if (toDate.isValid()) {
                if (fromDate && toDate.isBefore(fromDate)) {
                    valid = false
                } else {
                    date = toDate.toDate()
                    output = toDate.format(format)
                }
            }
        }

        this.setState({
            to: date || undefined,
            toValue: value,
            toValid: valid
        }, this.focusMonth)

        onEndChange.call(this, output)
    }

    handleToTba() {
        const { onEndChange, tbaValue } = this.props

        this.setState({
            to: undefined,
            toValue: '',
            toHint: tbaValue
        })

        onEndChange.call(this, tbaValue)
    }


    render() {
        const { displayFormat, startLabel, endLabel, tbaLabel } = this.props
        const { from, fromValue, fromHint, fromFocus, fromValid, to, toValue, toHint, toFocus, toValid } = this.state
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
                                    ref={$el => this.$fromInput = $el}
                                    value={from}
                                    placeholder={fromHint}
                                    format={displayFormat}
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    overlayComponent={XCalendarOverlay}
                                    inputProps={{
                                        readOnly: true,
                                        className: 'form-control XCalendar-Input--display'
                                    }}
                                    dayPickerProps={{
                                        modifiers,
                                        numberOfMonths: 2,
                                        selectedDays: [from, { from, to }],
                                        disabledDays: { after: to },
                                        toMonth: to,
                                        tbaLabel: tbaLabel,
                                        onDayClick: () => this.$toMask.focus(),
                                        onTbaClick: () => this.handleFromTba()
                                    }}
                                    onDayChange={date => this.handleFromChange(date)}
                                />

                                <InputMask
                                    inputRef={$el => this.$fromMask = $el}
                                    value={fromValue}
                                    placeholder={fromHint}
                                    className={`form-control XCalendar-Input--input${fromFocus ? '' : ' hidden'}`}
                                    style={{ color: fromValid ? 'inherit' : 'red' }}
                                    mask={this.inputMask}
                                    maskChar={this.inputMaskChar}
                                    onFocus={e => {
                                        this.$fromInput.handleInputFocus(e)
                                        this.handleFromFocus(true)
                                    }}
                                    onChange={e => this.handleFromChange(e.target.value)}
                                    onBlur={e => {
                                        this.$fromInput.handleInputBlur(e)
                                        this.handleFromFocus(false)
                                    }}
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
                                    ref={$el => this.$toInput = $el}
                                    value={to}
                                    placeholder={toHint}
                                    format={displayFormat}
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    overlayComponent={XCalendarOverlay}
                                    inputProps={{
                                        readOnly: true,
                                        className: 'form-control XCalendar-Input--display'
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
                                    onDayChange={date => this.handleToChange(date)}
                                />

                                <InputMask
                                    inputRef={$el => this.$toMask = $el}
                                    value={toValue}
                                    placeholder={toHint}
                                    className={`form-control XCalendar-Input--input${toFocus ? '' : ' hidden'}`}
                                    style={{ color: toValid ? 'inherit' : 'red' }}
                                    mask={this.inputMask}
                                    maskChar={this.inputMaskChar}
                                    onFocus={e => {
                                        this.$toInput.handleInputFocus(e)
                                        this.handleToFocus(true)
                                    }}
                                    onChange={e => this.handleToChange(e.target.value)}
                                    onBlur={e => {
                                        this.$toInput.handleInputBlur(e)
                                        this.handleToFocus(false)
                                    }}
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
    displayFormat: PropTypes.string,
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
    format: 'X',
    displayFormat: 'DD MMMM YYYY',
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
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { formatDate, parseDate } from 'react-day-picker/moment'
import InputMask from 'react-input-mask'
import XCalendarOverlay from './_XCalendarOverlay'
import XCalendarClear from './_XCalendarClear'

import 'react-day-picker/lib/style.css'
import './XCalendar.scss'

export default class XCalendar extends React.Component {
    constructor(props) {
        super(props)

        const { format, placeholder, start, end, tbaValue } = this.props
        const state = {
            from: undefined,
            fromBackup: undefined,
            fromValue: '',
            fromHint: placeholder,
            fromFocus: false,
            to: undefined,
            toBackup: undefined,
            toValue: '',
            toHint: placeholder,
            toFocus: false
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
                console.log(moment(to).diff(moment(from), 'months'))
                $toPicker && $toPicker.showMonth(moment(to).diff(moment(from), 'months') < 2 ? from : to)
            }
        }
    }


    handleFromFocus(focus) {
        const { placeholder, tbaValue } = this.props
        const { from, fromHint } = this.state

        this.setState({
            fromHint: fromHint === tbaValue && !from ? tbaValue : placeholder,
            fromFocus: focus
        }, this.focusMonth)
    }

    handleFromChange(value) {
        value = value instanceof Date ? formatDate(value, this.inputFormat) : value

        const { format, onStartChange } = this.props
        let nextState = {
            from: undefined,
            fromValue: value || ''
        }
        let output = null

        if (!this.containsMask(value)) {
            const { to } = this.state
            const toDate = to ? moment(to) : null
            const fromDate = moment(value, this.inputFormat)

            if (fromDate.isValid()) {
                nextState.from = fromDate.toDate()
                output = fromDate.format(format)

                if (toDate && fromDate.isAfter(toDate)) {
                    this.handleToChange(null)
                }
            }
        }

        this.setState({ ...nextState, fromBackup: nextState.from }, this.focusMonth)

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
        }, this.focusMonth)
    }

    handleToChange(value) {
        value = value instanceof Date ? formatDate(value, this.inputFormat) : value

        const { format, onEndChange } = this.props
        let nextState = {
            to: undefined,
            toValue: value || ''
        }
        let output = null

        if (!this.containsMask(value)) {
            const { from } = this.state
            const fromDate = from ? moment(from) : null
            const toDate = moment(value, this.inputFormat)

            if (toDate.isValid()) {
                nextState.to = toDate.toDate()
                output = toDate.format(format)

                if (fromDate && toDate.isBefore(fromDate)) {
                    this.handleFromChange(null)
                }
            }
        }

        this.setState({ ...nextState, toBackup: nextState.to }, this.focusMonth)

        onEndChange.call(this, output)
    }

    handleToHover(value) {
        this.setState({
            to: value,
            toValue: formatDate(value, this.inputFormat)
        })
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
        const { className, displayFormat, startLabel, endLabel, tbaLabel } = this.props
        const { from, fromValue, fromHint, fromFocus, to, toBackup, toValue, toHint, toFocus } = this.state
        const modifiers = {
            start: from,
            end: to
        }

        return (
            <div className={`XCalendar ${className || ''}`.trim()}>
                <div className="form-row">

                    <div className="col-sm">
                        <div className={`input-group XCalendar-From${fromFocus ? ' input-group-focused' : ''}`}>
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
                                    hideOnDayClick={false}
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
                                        format: displayFormat,
                                        tbaLabel: tbaLabel,
                                        onTbaClick: () => this.handleFromTba()
                                    }}
                                    onDayChange={date => this.handleFromChange(date)}
                                />

                                <InputMask
                                    inputRef={$el => this.$fromMask = $el}
                                    value={fromValue}
                                    placeholder={fromHint}
                                    className={`form-control XCalendar-Input--input${fromFocus ? '' : ' hidden'}`}
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

                                <XCalendarClear
                                    visible={!!from}
                                    buttonProps={{ onClick: e => this.handleFromChange(null) }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm">
                        <div className={`input-group XCalendar-To${toFocus ? ' input-group-focused' : ''}`}>
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
                                    hideOnDayClick={false}
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
                                        format: displayFormat,
                                        tbaLabel: tbaLabel,
                                        onDayMouseEnter: (date, modifiers) => {
                                            if (!modifiers.disabled) {
                                                this.handleToHover(date)
                                            }
                                        },
                                        onDayMouseLeave: () => this.handleToHover(toBackup),
                                        onTbaClick: () => this.handleToTba()
                                    }}
                                    onDayChange={date => this.handleToChange(date)}
                                />

                                <InputMask
                                    inputRef={$el => this.$toMask = $el}
                                    value={toValue}
                                    placeholder={toHint}
                                    className={`form-control XCalendar-Input--input${toFocus ? '' : ' hidden'}`}
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

                                <XCalendarClear
                                    visible={!!to}
                                    buttonProps={{ onClick: e => this.handleToChange(null) }}
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
    className: PropTypes.string,
    placeholder: PropTypes.string,

    format: PropTypes.string,
    displayFormat: PropTypes.string,

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
    className: null,
    placeholder: 'DD/MM/YYYY',

    format: 'X',
    displayFormat: 'DD MMMM YYYY',

    startLabel: 'From',
    start: undefined,
    onStartChange: function (value) { },

    endLabel: 'To',
    end: undefined,
    onEndChange: function (value) { },

    tbaValue: 'TBA',
    tbaLabel: `I'm not sure - date to be advised`
}
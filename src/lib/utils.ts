import axios from "axios"
import { type ClassValue, clsx } from "clsx"
import { addDays } from "date-fns"
import moment from "moment"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**Capitalize a string */
export function capitalize(str) {
  const strList = str.split(' ')
  return strList.map((val) => val.at(0).toUpperCase() + val.slice(1).toLowerCase()).join(' ')
}

export async function generateReport(loggerInfo, fields, dateRange, user) {
  const loggerId = loggerInfo.LoggerId
  let logTable = ''
  let data = []
  if (loggerInfo.Type.includes('pressure') && loggerInfo.Type.includes('flow')) {
    const logResponse = await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/logs/?timeStart=${dateRange?.from}&timeEnd=${addDays(dateRange?.to, 1)}&username=${user.Username}`, {
      logTypes: loggerInfo.Type.split(','),
      loggerId: loggerId,
    })
    data = logResponse.data
  } else {
    if (loggerInfo.Type.includes('flow')) logTable = "flow_log"
    else if (loggerInfo.Type.includes('pressure')) logTable = "pressure_log"
    const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/${logTable}/${loggerId}?timeStart=${dateRange?.from}&timeEnd=${addDays(dateRange?.to, 1)}&username=${user.Username}`)
    data = response.data ?? []
  }
  if (!data || data == "No logs found!") {
    throw "No data available for the selected time range. Please choose a different period and try again."
  }
  if (data.length) {
    const newData = data.reduce((newData, currentLog) => {
      let newLog = {
        LogTime: moment(currentLog.LogTime.replace('Z', '')).format('MM/DD/YYYY, hh:mm A')
      }
      for (const [field, includeField] of Object.entries(fields)) {
        if (!includeField) continue
        let key = ''
        if (field == "flow") key = "CurrentFlow"
        else if (field == "pressure") key = "CurrentPressure"
        else if (field == "voltage") key = "AverageVoltage"
        else if (field == "totalizerPositive") key = "TotalFlowPositive"
        else if (field == "totalizerNegative") key = "TotalFlowNegative"
        newLog = {
          ...newLog,
          [key]: currentLog[key]
        }
      }
      newData.push(newLog)
      return newData
    }, [])
    return newData
  }
}

export function jsonToCSV(jsonArr, header) {
  let csv = header + '\n'
  let delim = ';'
  csv += Object.keys(jsonArr[0]).join(delim) + '\n'
  jsonArr.forEach(obj => {
    csv += Object.values(obj).join(delim) + '\n'
  });
  const filename = header.split(' ')[0] + '_' + jsonArr[0].LogTime.split('T')[0]
  const extension = "csv"
  const _blob = new Blob([csv], { type: "text/plain" })
  const url = URL.createObjectURL(_blob)
  const link = document.createElement("a");
  link.download = `${filename}.${extension}`
  link.href = url;
  return link
}

// Check a value against a given limit (csv - low,high)
// true - in range, false - outside
export function isValueInRange (limits, value){
  const [low, high] = limits.split(',').map(Number);
  return value >= low && value <= high;
};

export function lerp(min, max, val){
  return (val-min)/(max-min)*100
}
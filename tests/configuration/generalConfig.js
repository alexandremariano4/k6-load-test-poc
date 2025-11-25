import { htmlReport } from '../report/htmlReport.js';
import { textSummary } from '../report/textSummary.js';


export function defaultHandleSummary(filename){
    return function handleSummary(data) {
            return {
                [`logs/${filename}`]: htmlReport(data),
                stdout: textSummary(data, { indent: ' ', enableColors: true }),
            };
        }
    }

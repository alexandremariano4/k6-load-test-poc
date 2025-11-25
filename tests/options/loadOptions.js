export function loadOptions() {

    return {
        stages:[
            {duration: '20s', target: 100},
            {duration: '30s', target: 120},
            {duration: '15s', target: 0},
        ],
        thresholds: {   
            http_req_duration: ['p(95)<200'], // 95% das requisições devem responder em até 1.5 segundos
            http_req_failed: ['rate<0.01'], // 1% das requisiçoes podem ocorrer erro
        }
    }
}
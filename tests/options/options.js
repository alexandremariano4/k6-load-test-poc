import { __ENV } from 'k6';

export function accountOptions() {
    const vu_1 = (__ENV && __ENV.K6_VUS_1) ? parseInt(__ENV.K6_VUS_1) : 10;
    const duration_1 = (__ENV && __ENV.K6_DURATION_1) ? __ENV.K6_DURATION_1 : '30s';

    const vu_2 = (__ENV && __ENV.K6_VUS_2) ? parseInt(__ENV.K6_VUS_2) : 40;
    const duration_2 = (__ENV && __ENV.K6_DURATION_2) ? __ENV.K6_DURATION_2 : '60s';
    
    const vu_3 = (__ENV && __ENV.K6_VUS_3) ? parseInt(__ENV.K6_VUS_3) : 20;
    const duration_3 = (__ENV && __ENV.K6_DURATION_3) ? __ENV.K6_DURATION_3 : '90s';
    
    return {
        cloud:{
            name: 'SmartBit - Accounts Test',
            projectID: 5967242, 
            staticIPs: false,
            drop_metrics: ['http_req_tls_handshaking']
        },
        // vu:10,
        // duration: '30s',
        stages:[
            {duration: duration_1, target: vu_1},
            {duration: duration_2, target: vu_2},
            {duration: duration_3, target: vu_3},
        ],
        thresholds: {   
            http_req_duration: [
                'p(95)<200',
                'p(99)<400',
                'avg<150',
            
            ], /*
            95% das requisições devem responder em até 200ms
            99% das requisições devem responder em até 400ms
            tempo médio de resposta deve ser menor que 150ms
            */
            http_req_failed: ['rate<0.01'], // 1% das requisições podem ocorrer erro
            // http_reqs: [
            //     'rate>30'
            // ]
        }
    }
}
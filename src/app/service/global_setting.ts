import { ENV } from '@app/env';
// const host = 'http://api.pandafintech.com.mx'; //线上环境
// const host = 'http://10.0.52.129:8200' ;
// const  host = 'http://192.168.24.100:9030' ;//测试环境
// const  host = 'http://52.53.149.101:9001' ;//运维环境（预发测试环境）
const host = ENV.domain;
console.log(ENV);

export const GLOBAL = {
    API: {
        review: {
            realName: host + "/user/authentication",
            usrInfo: host + "/user/info",
            family: host + "/user/family",
            income: host + "/user/work",
            contact: host + "/user/contact" ,
            stayTime : host + "/user/behavior/page/duration"
        },
        homePage: {
            accountInfo: host + "/account/query",
            orderStatus: host + "/order/user"
        },
        investList: {
            record: host + "/order/record",
            detail: host + "/order/detail",
        },
        loan: {
            purpose: host + "/system/borrow/purpose",
            condition: host + "/user/authentication/credit/condition",
            create: host + "/order/create",
            queryPlan: host + "/repayment",
            queryRepayPlan : host + "/repayment/currentRepay",
            getRepayId : host + "/pay/queryStoreCharge",
            enchashment: host + "/account/cash",
            checkAuth: host + "/account/isAuth",
            bank: {
                list: host + "/bank/support",
                bindBank: host + "/bank/binding",
                usrBank: host + "/bank/personal",
                update : host + "/bank",
                chooseCoupon : host + "/coupon/chooseCoupon",
                countNewUserClickCashDetail: host + "/account/cash/countNewUserClickCashDetail",
            },
            checkPass: host + "/account/payment/password/exist", //检测是否有支付密码
            setPass: host + "/account/payment/password/set",//设置密码
            contract: host + "/system/borrow/contract",
            apkVersion: host + "/system/apkVersion",
            countNewUserClick: host + "/system/borrow/countNewUserClick",
            cashNewUserClick: host + "/account/cash/countNewUserClick"
        },
        helpCenter: {
            tabsGroup: host + "/system/help/center"
        },
        aboutMoney:{
            repayment: host + "/system/about/repayment"
        },
        feedBack:{
            getCof: host + "/system/opinion/config",
            opinion: host + "/system/opinion"
        },
        contractAll: {
            covers: host + '/system/covers/contract',//合同封面
            payback:host + '/system/payback/contract',//偿还表
            agreement: host + '/system/agreement/contract'//借款合同
        },
        reward: {
            getCoupons: host + '/coupon/getCoupons' ,//我的优惠券列表
            chooseCoupon: host + '/coupon/chooseCoupon', //提现时选择优惠券
            getCenterReward: host + '/coupon/couponCenter', //领券中心列表
            postCenterReward: host + '/coupon/activateCoupon', //领取优惠券
        },
        pay: {
            repay: host + '/pay/rePay', //在线还款
            getRePayStatus: host + '/pay/rePayStatus', //查询还款状态
        }
    }
}
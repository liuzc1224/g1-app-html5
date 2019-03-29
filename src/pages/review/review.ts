import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Slides, Content } from 'ionic-angular';
import { RealNameSerive, UsrInfoService, FamilyService, IncomeService, ContactService } from '../../app/service/review';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ImgService } from '../../app/service/common';
import { TipService } from '../../app/service/common';
import { Response } from '../../app/share/model/response.model';
import { ModalComponent } from '../../components/modal/modal';
import { EmitService } from '../../app/service/event-emit.service';
import { unixTime, timeTool } from '../../app/share/tool';
import { Observable } from 'rxjs';
import { ReviewproPage } from '../../pages/reviewpro/reviewpro';
import { LoanService } from '../../app/service/loan';
import { SesssionStorageService } from '../../app/service/common/storage';
import { filter, first } from 'rxjs/operators';
/**
 * Generated class for the ReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
    name: "ReviewPage"
})
@Component({
    selector: 'page-review',
    templateUrl: 'review.html',
    providers: [RealNameSerive, UsrInfoService, FamilyService, IncomeService, ContactService, ImgService],
})
export class ReviewPage {

    swiper: any;

    @ViewChild(Slides) slider: Slides;
    @ViewChild(Content) content: Content;

    slidesOptions = { initialSlide: 0 };

    onIonDrag(event) {

        this.swiper = event;

        this.swiper.lockSwipes();

    };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private translate: TranslateService,
        private realNameSer: RealNameSerive,
        private fb: FormBuilder,
        private imgSer: ImgService,
        private msg: TipService,
        private usrService: UsrInfoService,
        private familySer: FamilyService,
        private modalCtrl: ModalController,
        private emit: EmitService,
        private loadingSer: LoadingController,
        private incomeSer: IncomeService,
        private contactSer: ContactService,
        private loanSer: LoanService,
        private sgo: SesssionStorageService
    ) {
        this.initRealNameForm();
        this.initInfoForm();
        this.initFamilyForm();
        this.initIncomeForm();
        this.initContacts();
    }

    ionViewDidLoad() {
        this.getLang();
        this.stayTime = timeTool.getNowTimeStamp();
    };

    private title: string;

    languagePack: Object;

    currentStep: number = 0;

    curpPop: boolean = false;

    private stayTime: number;

    getLang() {
        this.translate.stream(['review', 'common'])
            .subscribe(
                res => {

                    this.languagePack = res;

                    let idx = this.currentStep;

                    this.title = this.languagePack['review']['steps'][idx];

                    this.enum_marry = this.languagePack['review']['form']['infoForm']['enums']['marray'];

                    this.enum_sex = this.languagePack['review']['form']['infoForm']['enums']['sex'];

                    this.enum_degree = this.languagePack['review']['form']['infoForm']['enums']['degree'];

                    this.addressGroup = this.languagePack['review']['form']['infoForm']['placeUd']

                    this.enum_income = this.languagePack['review']['form']['income']['enums']['incomeSource'];

                    this.enum_homeType = this.languagePack['review']['form']['faimly']['enums']['homeType'];

                    this.initStep();
                }
            )
    };

    contactList: Array<object> = [];//通讯录列表

    onLinEcontactList: Array<object> = [];// 已填通讯录列表

    ngAfterViewInit() {
        let __this = this;
        this.slider.onlyExternal = true;
        this.regitLocation();
        //是否授权通讯录
        window['notifyContact'] = function (data) {
            let info = data && JSON.parse(data);
            if (info.code == 1 && info.data.length ) {
                __this.contactList = info.data;
                __this.tshowModal(__this.currentIndex)
            } else {
                __this.commonLoading.dismiss();
            }
        }
        window['notifyUploadCall'] = function (data) {
            let info = data && JSON.parse(data);
            if (info.code == 0) {

            }
        }
        window['notifySms'] = function (data) {
            let info = data && JSON.parse(data);
        }
        //活体识别结果回调
        window['uploadfacefinish'] = function (data, msg) {

            if (data == 'success') {
                __this.currentStep += 1;

                __this.initStep();

                let now = timeTool.getNowTimeStamp();

                let diff = now - __this.stayTime;

                __this.usrService.stayTime({
                    "durationTime": diff,
                    "pageIndex": 1
                }).subscribe();

            }else{
                __this.commonLoading.dismiss();
            }
        }

        window['getLocInfo'] = function (data) {
            let info = data && JSON.parse(data);
            if (info.code == 1) {
                let list = {};
                list['latitude'] = info.latitude;
                list['longitude'] = info.longitude;

                __this.sgo.set("useLocInfo", JSON.stringify(info.latitude));
                __this.unregitLocation()
            }
        }


    }



    slideTo(index: number) {
        if (index > this.currentStep) {
            return;
        } else {
            this.currentStep = index;
            this.slider.slideTo(index);
            this.content.scrollToTop();
        };
    };

    getInfo() {
        this.realNameSer.get()
            .subscribe(
                (res: Response) => {
                    if (res.success === true) {
                        if (res.data) {
                            if (res.data['modifyTime']) {
                                res.data['isFirst'] = false;
                            } else {
                                res.data['front'] = null;
                                res.data['reverse'] = null;
                                // res.data['hand'] = null;
                            };
                            this.hasFaceNow = res.data['faceCompareButton'] === 'true' || res.data['faceCompareButton'] === true ? true : false;
                            this.realNameForm.patchValue((<Object>res.data));
                        }
                    } else {
                        this.msg.operateFail(res.message)
                    };
                }
            )
    };

    realNameForm: FormGroup;

    initRealNameForm() {

        this.realNameForm = this.fb.group({
            "front": [null, Validators.required],
            "reverse": [null, Validators.required],
            // "hand": [null, Validators.required],
            "username": [null, Validators.required],
            "fatherFirstName": [null, Validators.required],
            "motherFirstName": [null],
            'idNumber': [null, [Validators.required]],
            "isFirst": [true, [Validators.required]],
            "rfc": [null, [Validators.required]],
        });
        this.sliceRfc()
    };

    commonLoading: any;

    realNameFormData = new FormData();

    hasFaceNow: Boolean = false;


    submitRealName() {

        // let formData = this.realNameFormData ;
        let value = this.realNameForm.value;

        let postData = {
            username: value["username"],
            isFirst: value['isFirst'],
            idNumber: value['idNumber'].toUpperCase(),
            rfc: value['rfc'].toUpperCase(),
            fatherFirstName: value['fatherFirstName'],
            motherFirstName: value['motherFirstName']
        };

        if (window['JsInterface']) {
            let __this = this;

            this.showLoading();
            window['JsInterface']['postRealName'](JSON.stringify(postData));

            let markInterval = setInterval(() => {

                if (window.sessionStorage['realNameMark']) {


                    let mark = JSON.parse(window.sessionStorage['realNameMark']);

                    window.sessionStorage.removeItem("realNameMark");

                    //'0' 是成功  '1是失败'
                    if (mark.code == 0) {


                        if (__this.hasFaceNow) {
                            window['JsInterface']['uploadfaceNow']();
                        }else{
                            __this.currentStep += 1;

                            __this.initStep();

                            let now = timeTool.getNowTimeStamp();

                            let diff = now - this.stayTime;

                            this.usrService.stayTime({
                                "durationTime": diff,
                                "pageIndex": 1
                            }).subscribe();
                        }


                    } else {

                        __this.msg.operateFail(mark.data);

                        __this.commonLoading.dismiss();

                    };
                    clearInterval(markInterval);
                }
            }, 200);
        };
    };

    rfc1: string
    rfc2: string


    sliceRfc() {
        this.realNameForm.get('rfc').valueChanges
            .subscribe(
                res => {
                    let str1 = '',
                        str2 = '';
                    if (!res) {
                        res = '';
                    }
                    for (let i = 0; i < res.length; i++) {
                        if (i < 10) {
                            str1 += res[i];

                        } else {

                            str2 += res[i];

                        }
                    }
                    this.rfc1 = str1;
                    this.rfc2 = str2;
                }
            )

    }

    imgChange($event: Event, formName: string, itemName: string) {

        if (window['JsInterface']) {
            window['JsInterface']['openCamera'](itemName);
        } else {
            return;
        };

        let __this = this;


        let timeInterval = setInterval(function () {

            let imgUrl = window.sessionStorage['imgUrl'];


            if (imgUrl) {
                if (imgUrl != 'cancelCamera') {

                    let obj = {};

                    obj[itemName] = imgUrl;

                    __this[formName].patchValue(obj);

                };

                window.sessionStorage.removeItem("imgUrl");

                clearInterval(timeInterval);
            };
        }, 200);

    };

    initStep() {
        const step = this.currentStep;

        document.title = this.title;

        if (step === 0) {
            this.getInfo();
        };

        if (step === 1) {
            this.getUsrInfo();
        };

        if (step === 2) {
            this.getFamilyInfo();
        };

        if (step === 3) {
            this.getIncomeInfo();
        };

        if (step === 4) {
            this.getContact();

        };

        if (step == 5) {
            this.commonLoading.dismiss();
            this.navCtrl.push(ReviewproPage);
        };
    };

    enum_degree: Array<{ name: string, value: number }>;

    enum_sex: Array<{ name: string, value: number }>;

    addressGroup: Array<{ name: string }>;

    enum_marry: Array<{ name: string, value: number }>;

    enum_income: Array<{ name: string, value: number }>;

    enum_homeType: Array<{ name: string, value: number }>;

    infoForm: FormGroup;

    initInfoForm() {

        this.infoForm = this.fb.group({
            birthday: [null, [Validators.required]],
            birthplace: [null, [Validators.required]],
            email: [null, [Validators.required]],
            gender: [null, [Validators.required]],
            maritalStatus: [null, [Validators.required]],
            educationBackground: [null, [Validators.required]],
            stateCode: [null, [Validators.required]]
        });

    }

    submitInfoForm() {
        let data = this.infoForm.value;
        this.showLoading();

        this.usrService.put(data)
            .subscribe(
                (res: Response) => {
                    if (res.success === true) {
                        this.currentStep += 1;
                        this.initStep();

                        let now = timeTool.getNowTimeStamp();

                        let diff = now - this.stayTime;

                        this.usrService.stayTime({
                            "durationTime": diff,
                            "pageIndex": 2
                        }).subscribe();

                    } else {
                        this.msg.operateFail(res.message);
                    }
                }
            )
    };

    getUsrInfo() {
        this.usrService.get()
            .subscribe(
                (res: Response) => {

                    this.commonLoading.dismiss();

                    if (res.success === true) {

                        if (res.data) {
                            // res.data['birthday'] = unixTime(res.data['birthday'], 'y-m-d');
                            // console.log(res.data);
                            this.infoForm.patchValue((<Object>res.data));
                        };

                        this.slideTo(this.currentStep);

                    } else {
                        this.msg.operateFail(res.message)
                    };
                }
            )
    };

    familyForm: FormGroup;
    initFamilyForm() {
        this.familyForm = this.fb.group({
            fatherName: [null, [Validators.required]],//父亲全名
            motherName: [null, [Validators.required]],//母亲全名
            familyMembersCount:[null, [Validators.required]],//家庭人数
            homeAddress: [null, [Validators.required]],//家庭详细街道
            homeBlock: [null, [Validators.required]],//家庭地址区
            homeMpio: [null, [Validators.required]],//家庭地址mpio
            homeCity: [null, [Validators.required]],//家庭地址城市
            homeState: [null, [Validators.required]],//家庭地址洲
            addressType:[null, [Validators.required]],//住宅类型
            addressPostCode:[null, [Validators.required]],//住宅邮编
            homeTelephone: [null, [Validators.required]],//家庭电话
            residentialProof: [null, [Validators.required]],//住址证明
            isFirst:[true, [Validators.required]]
            // homeStreet: [null, [Validators.required]],//家庭详细街道
        })
    };

    submitFamilyForm() {
        let data = this.familyForm.value;
        // this.showLoading();
        // this.familySer.put(data)
        //     .subscribe(
        //         (res: Response) => {
        //             if (res.success === true) {

        //                 this.currentStep += 1;

        //                 this.initStep();

        //                 let now = timeTool.getNowTimeStamp();

        //                 let diff = now - this.stayTime;

        //                 this.usrService.stayTime({
        //                     "durationTime": diff,
        //                     "pageIndex": 3
        //                 }).subscribe();

        //             } else {
        //                 this.msg.operateFail(res.message);
        //             }
        //         }
        //     )
            let value = this.familyForm.value;
            let postData = {
                fatherName: value["fatherName"],
                motherName: value["motherName"],
                homeTelephone: value["homeTelephone"],
                homeAddress: value["homeAddress"],
                homeBlock: value["homeBlock"],
                homeMpio: value["homeMpio"],
                homeCity: value["homeCity"],
                homeState: value["homeState"],
                familyMembersCount: value["familyMembersCount"],
                addressType: value["addressType"],
                addressPostCode: value["addressPostCode"],
                isFirst: value['isFirst']
            };
            if (value.residentialProof) {
                postData['isFirst'] = false;
            }
            if (window['JsInterface']) {
                let __this = this;

                this.showLoading();

                window['JsInterface']['uploadFamalyInfo'](JSON.stringify(postData));

                let markInterval = setInterval(() => {

                    if (window.sessionStorage['realNameMark']) {
                        let mark = JSON.parse(window.sessionStorage['realNameMark']);

                        if (mark.code == 0) {

                            __this.currentStep += 1;

                            __this.initStep();

                            let now = timeTool.getNowTimeStamp();

                            let diff = now - this.stayTime;

                            this.usrService.stayTime({
                                "durationTime": diff,
                                "pageIndex": 3
                            }).subscribe();

                        } else {

                            __this.msg.operateFail(mark.data);


                            __this.commonLoading.dismiss();

                        };
                        clearInterval(markInterval);
                    }
                }, 200);
            };
    };

    getFamilyInfo() {
        this.familySer.get()
            .subscribe(
                (res: Response) => {
                    this.commonLoading.dismiss();
                    if (res.success === true) {

                        this.slideTo(this.currentStep);

                        if (res.data){

                            if (res.data['modifyTime']) {
                                res.data['isFirst'] = false;
                            } else {
                            };

                            this.familyForm.patchValue((<Object>res.data));
                        }

                    } else {
                        this.msg.operateFail(res.message);
                    };
                }
            )
    }

    incomeForm: FormGroup;
    //收入证明开关
    incomeStatus : boolean = false;

    initIncomeForm() {
        this.incomeForm = this.fb.group({
            "incomeSource": [null, [Validators.required]],//收入来源
            "company": [null],//所在公司
            "companyAddress": [null],//公司地址
            "position": [null],//职业
            "incomeProof": [null, (this.incomeStatus && [Validators.required]) ],//收入证明
            "isFirst": [true, [Validators.required]],
            // "companyStreet": [null],//公司地址
            "companyBlock": [null],//公司地址区
            "companyMpio": [null],//公司地址mpio
            "companyCity": [null],//公司地址城市
            "companyState": [null],//公司地址洲
            "companyPostCode": [null],//公司邮编
        })
    };

    submitIncomeForm() {

        let value = this.incomeForm.value;
        let postData = value;

        if (window['JsInterface']) {
            let __this = this;

            this.showLoading();

            window['JsInterface']['postInCome'](JSON.stringify(postData));

            let markInterval = setInterval(() => {

                if (window.sessionStorage['realNameMark']) {
                    let mark = JSON.parse(window.sessionStorage['realNameMark']);

                    if (mark.code == 0) {

                        __this.currentStep += 1;

                        __this.initStep();

                        let now = timeTool.getNowTimeStamp();

                        let diff = now - this.stayTime;

                        this.usrService.stayTime({
                            "durationTime": diff,
                            "pageIndex": 4
                        }).subscribe();

                    } else {

                        __this.msg.operateFail(mark.data);


                        __this.commonLoading.dismiss();

                    };
                    clearInterval(markInterval);
                }
            }, 200);
        };
    }
    getIncomeInfo() {
        this.incomeSer.get()
            .subscribe(
                (res: Response) => {
                    this.commonLoading.dismiss();
                    if (res.success === true) {

                        this.slideTo(this.currentStep);

                        if (res.data) {

                            if (res.data['modifyTime']) {
                                res.data['isFirst'] = false;
                            } else {
                            };
                            // 收入证明开关
                            this.incomeStatus = res.data['incomeStatus'];
                            this.initIncomeForm();
                            this.incomeForm.patchValue((<Object>res.data));

                        };

                    } else {
                        this.msg.operateFail(res.message);
                    };
                }
            )
    };

    currentIndex: number
    getusecontact(index: number) {
        this.currentIndex = index;
        this.showLoading();
        if (!this.contactList.length) {
            this.userToCont();
        } else {
            this.tshowModal(index);
        }
        if (index === 2) {
            this.useElseCallRecord();
        }
        if (index === 3) {
            this.useElseSms();
        }
    };

    tshowModal(index: number) {

        let __this = this;
        this.commonLoading.dismiss();

        const data = this.contactList;
        let info = [];
        data.forEach(item => {
            info.push({
                name: item['contactName'],
                phone: item['contactPhone'],
                contactGrade: index
            })
        });

        let profileModal = this.modalCtrl.create(ModalComponent, { data: info });

        profileModal.onDidDismiss((data, k) => {

            if (data) {
                const obj = {};
                obj['contactGrade'] = data['contactGrade'];
                obj['contactName'] = data['name'];
                obj['contactPhone'] = data['phone'];
                obj['contactIndex'] = data['name'] + data['phone'];
                this['contactsForm'].get("userContactInputVOS")['controls'][index - 1].patchValue(obj);

            };
        });
        profileModal.present();
    };

    showModal(type: string, formName: string, formItem: string) {
        const data = this[type];

        let profileModal = this.modalCtrl.create(ModalComponent, { data: data });

        profileModal.onDidDismiss(data => {
            if (data) {
                const obj = {};

                obj[formItem] = data.value;

                if (formItem === 'stateCode' || formItem === 'homeState' || formItem === 'companyState') {
                    obj[formItem] = data.name;
                }
                this[formName].patchValue(obj);

            };
        });
        profileModal.present();
    };

    contactsForm: FormGroup;
    initContacts() {

        this.contactsForm = this.fb.group({
            "userContactInputVOS": this.fb.array([])
        });

    };

    submitContact() {
        let data = this.contactsForm.value.userContactInputVOS;
        let contactData = this.contactList;
        let passMark: boolean = false;

        let _hasMap = {};

        // userContactInputVOS : [{} , {} , {}] ;

        for (let i = 0; i < data.length; i++) {
            let now = data[i];
            let next = data[(i + 1 >= data.length ? 0 : i + 1)];
            if (now['contactPhone'] === next['contactPhone']) {
                passMark = true;
                break;
            }
        }

        if (passMark === true) {
            let msg = this.languagePack['common']['tips']['repeat'];

            this.msg.operateFail(msg);
            return;
        };


        this.showLoading();

        this.contactSer.put(this.contactsForm.value)
            .subscribe(
                (res: Response) => {
                    if (res.success === true) {

                        let data = this.sgo.get("loanInfo");

                        this.loanSer.createOrder(data)
                            .pipe(
                                filter((res: Response) => {

                                    this.commonLoading.dismiss();

                                    if (res.success !== true) {

                                        this.msg.operateFail(res.message);

                                    };
                                    return res.success === true;
                                })
                            )
                            .subscribe(
                                (res: Response) => {
                                    //下单成功调用接口，统计
                                    if (window['JsInterface'] && window['JsInterface']['ordenSucess']) {
                                        window['JsInterface']['ordenSucess']()
                                    }
                                    let now = timeTool.getNowTimeStamp();

                                    let diff = now - this.stayTime;

                                    this.usrService.stayTime({
                                        "durationTime": diff,
                                        "pageIndex": 1
                                    }).subscribe(
                                        res => {
                                            this.navCtrl.push(ReviewproPage);
                                        }
                                    );
                                }
                            );
                    } else {
                        this.msg.operateFail(res.message);
                    }
                }
            )
    };

    getContact() {
        this.contactSer.get()
            .subscribe(
                (res: Response) => {

                    this.commonLoading.dismiss();

                    if (res.success === true) {

                        this.slideTo(this.currentStep);
                        this.contactsForm.controls['userContactInputVOS']['controls'] = [];

                        if (res.data && (<Array<Object>>res.data).length > 0) {

                            let data = (<Array<Object>>res.data);

                            this.onLinEcontactList = data;

                            data.forEach((item, i) => {
                                this.add(1, item, true, i);
                            })
                        };
                        if (res.data && (<Array<Object>>res.data).length == 0) {
                            this.add(3, null, false);
                        };
                    } else {
                        this.msg.operateFail(res.message)
                    };
                }
            )
    }
    add(times: number = 3, itemInfo?: object, agin?: boolean, index?: Number) {

        for (let i = 0; i < times; i++) {
            const control = <FormArray>this.contactsForm.controls['userContactInputVOS'];
            control.push(this.createContact(i + 1, itemInfo, agin, index));
        };
    };

    createContact(level: number, item: Object, agin: boolean, index: Number) {
        if (agin) {
            return this.fb.group({
                "contactGrade": [level, [Validators.required]],
                "contactName": [item && item['contactName'] ? item['contactName'] : null],
                "contactPhone": [item && item['contactPhone'] ? item['contactPhone'] : null],
                "contactIndex": [item['contactName'] + item['contactPhone'], [Validators.required]]
            });
        } else {
            return this.fb.group({
                "contactGrade": [level, [Validators.required]],
                "contactName": [item && item['contactName'] ? item['contactName'] : null],
                "contactPhone": [item && item['contactPhone'] ? item['contactPhone'] : null],
                "contactIndex": [null, [Validators.required]]
            });
        }

    };

    get userContactInputVOS(): FormArray {
        return this.contactsForm.get("userContactInputVOS") as FormArray;
    };


    showLoading() {

        this.commonLoading = this.loadingSer.create({
            content: 'loading...'
        });

        this.commonLoading.present();
    };

    backHistory() {
        this.navCtrl.pop();
    };

    //获取用户通讯录
    // contactList : Array<object> = [{contactName:'aa',contactPhone:'1231231',contactIndex:'0'},{contactName:'cc',contactPhone:'1231231',contactIndex:'1'},{contactName:'dd',contactPhone:'1231231',contactIndex:'2'}]
    userToCont() {
        if (window['JsInterface']) {
            window['JsInterface']['postContact'](this.contactList.length ? 'false' : 'true');//
        }
    };

    useElseCallRecord() {
        if (window['JsInterface']) {
            window['JsInterface']['uploadCallRecord']();
        }
    }

    useElseSms() {
        if (window['JsInterface']) {
            window['JsInterface']['uploadSms']();//
        }
    }

    regitLocation() {
        if (window['JsInterface']) {
            window['JsInterface']['regitLocation']();//
        }
    }
    unregitLocation() {
        if (window['JsInterface']) {
            window['JsInterface']['unregitLocation']();//
        }
    }

    showCurpPop() {
        this.curpPop = true;
    }
    closePop() {
        this.curpPop = false;
    }

};
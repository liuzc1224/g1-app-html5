import { Component , OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BankService } from '../../app/service/loan/bank.servive'
import { filter } from 'rxjs/operators';
import { Response } from "../../app/share/model" ;
import { TipService, SesssionStorageService } from '../../app/service/common';
import { IonicPage, ModalController ,LoadingController , NavController , Events } from 'ionic-angular';
import { ModalComponent } from '../../components/modal/modal' ;
import { TranslateService } from '@ngx-translate/core';
declare var OpenPay: any;

@IonicPage({
  name: 'addAccount'
})
@Component({
  selector: 'page-add-account',
  templateUrl: 'add-account.html',
})
export class AddAccountPage implements OnInit {

  constructor(
    private fb : FormBuilder ,
    public navCtrl: NavController,
    private bankSer : BankService ,
    private tipSer : TipService ,
    private modalCtrl : ModalController ,
    private loadingSer : LoadingController ,
    private translate : TranslateService ,
    private navCtr : NavController ,
    private emit : Events ,
    private sgo : SesssionStorageService,
    private TipService: TipService,
  ) {}
  ngOnInit(){
    this.initForm() ;

    this.emit.subscribe("checkCard", data => {
        this.isCheck = data;
        this.emit.unsubscribe("checkCard");
    });

    this.getLang() ;

    // let data = this.sgo.get("bankInfo") ;

    let userAllName = this.sgo.get("userAllName") ;

    // if(data){
    //     this.validateForm.patchValue(data) ;
    //     this.bankInfo = data ;
    // };

    if(userAllName){
        this.validateForm.patchValue({ userName:userAllName}) ;
    };

	};

	ionViewDidLoad() {
		document.title = 'Añade cuenta bancaria'
	}
	isCheck: string = "1";
	validateForm : FormGroup ;

	private bankInfo : Object ;
	bankCardNum : string;
	deviceSessionId: string;

	initForm(){
		this.validateForm = this.fb.group({
			// bankId :  [null , []] ,
			// bankName : [null, []] ,
			clabeNum :  [null , [Validators.required,Validators.maxLength(20)]] ,
			bankCardNum : [null , [Validators.maxLength(19)] ] ,
			userName : [null , [Validators.required]] 
		});
		this.bankCardNum = this.validateForm.value.bankCardNum
		OpenPay.setSandboxMode(true);
		this.deviceSessionId = OpenPay.deviceData.setup();
	};

	enum_bank : Array < Object >;

	getBankList(){
		this.bankSer.getList()
			.pipe(
				filter(
					( res : Response) => {

						if(res.success === false){
								this.tipSer.fetchFail(res.message) ;
						};
						return res.success === true ;
					}
				)
			)
			.subscribe(
				(res : Response) => {

					const data = [] ;

					if( (< Array < Object > >res.data).length > 0 ){

						(< Array < Object > >res.data).forEach( item => {
							data.push({
								name : item['bankName'] ,
								value : item['id'] ,
								icon : item['bankIconUrl']
							})
						});
						this.enum_bank = data ;
					};
				}
			)
	};

	showModal(type : string , formName : string , formItem : string){

		const data = this[type] ;

		let profileModal = this.modalCtrl.create(ModalComponent, { data: data });

		profileModal.onDidDismiss( data => {
			const obj = {} ;

			obj[formItem] = data && data.value ;
			obj['bankName'] = data && data.name ;

			this[formName].patchValue(obj)
		});

		profileModal.present();
	};

	commonLoading : any ;

	showLoading(){

		this.commonLoading = this.loadingSer.create({
			content: 'loading...'
		});

		this.commonLoading.present() ;

	};

	languagePack : Object ;


	getLang(){
		this.translate.stream(['review' , 'common'])
			.subscribe(
				res => {
					this.languagePack = res ;
				}
			)
	};


	validateCard(){
		let cardInfo=this.validateForm.value;
		this.navCtrl.push("checkCard",cardInfo) ;
			

	}

	submit($event){
			let postData = this.validateForm.value;
			// postData.deviceSessionId = this.deviceSessionId;
			postData.isCheck = '1';
			this.showLoading() ;
			console.log(postData)


			if(this.bankInfo && this.bankInfo !== "undefined"){
				this.bankSer.bind(postData)
					.pipe(
						filter(
							(res: Response) => {
								if(res.success === false){
									this.tipSer.operateFail(res.message) ;
								};

								this.commonLoading.dismiss() ;
								return res.success === true ;
							}
						)
					)
					.subscribe(
						(res : Response) => {
							this.tipSer.operateSuccess() ;
							this.backHistory(true) ;
						}
					)
			}else{
					this.bankSer.bind(postData)
						.pipe(
							filter(
								(res: Response) => {
									if(res.success === false){
										this.tipSer.operateFail(res.message) ;
									};

									this.commonLoading.dismiss() ;
									return res.success === true ;
								}
							)
						)
						.subscribe(
							(res : Response) => {
								this.tipSer.operateSuccess() ;
								this.backHistory(true) ;
							}
						)
			}
	};


	backHistory(mark : boolean = false){
		this.navCtr.pop()
			.then(
				() => {
					this.emit.publish("account" , "success")
				}
			)
	};

}

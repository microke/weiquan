package com.weiquan.domain;

import com.weiquan.common.WqException;
import com.weiquan.util.TransferUtil;

public class VipLevel {
	private long vipId;
	private String vipName;
	private String vipPower;
	private double rateOfMonth;//一月价格
	private double rateOfTreeMonth;//三月价格
	private double rateOfHarfYear;//半年价格
	private double rateOfYear;//一年价格
	private double rateOfForever;//永久价格
	private String memo;
	
	public int getPower(Integer powerSite) throws WqException{
		if(this.vipPower.length() <= powerSite && powerSite>0){
			throw new WqException("ERROR.VIPLEVEL.POWERSITENOTEXSIT");
		}
		return TransferUtil.letterToNum(this.vipPower.substring(powerSite, powerSite+1));
	}
	
	public long getVipId() {
		return vipId;
	}
	public void setVipId(long vipId) {
		this.vipId = vipId;
	}
	public String getVipName() {
		return vipName;
	}
	public void setVipName(String vipName) {
		this.vipName = vipName;
	}
	public String getVipPower() {
		return vipPower;
	}
	public void setVipPower(String vipPower) {
		this.vipPower = vipPower;
	}
	public double getRateOfMonth() {
		return rateOfMonth;
	}
	public void setRateOfMonth(double rateOfMonth) {
		this.rateOfMonth = rateOfMonth;
	}
	public double getRateOfTreeMonth() {
		return rateOfTreeMonth;
	}
	public void setRateOfTreeMonth(double rateOfTreeMonth) {
		this.rateOfTreeMonth = rateOfTreeMonth;
	}
	public double getRateOfHarfYear() {
		return rateOfHarfYear;
	}
	public void setRateOfHarfYear(double rateOfHarfYear) {
		this.rateOfHarfYear = rateOfHarfYear;
	}
	public double getRateOfYear() {
		return rateOfYear;
	}
	public void setRateOfYear(double rateOfYear) {
		this.rateOfYear = rateOfYear;
	}
	public double getRateOfForever() {
		return rateOfForever;
	}
	public void setRateOfForever(double rateOfForever) {
		this.rateOfForever = rateOfForever;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
}

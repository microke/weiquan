package com.weiquan.domain;

import java.util.List;

import com.weiquan.domain.annotation.AttrAnnotation;

/**
 * 货源
 * @author ZL
 *
 */
public class Goods extends CommonIndex implements ObjectLabelInterface{
	/**
	 * 货源编号
	 */
	private long goodsId;
	
	private String goodsName;//货源名称
	
	@AttrAnnotation
	private long industryId;//所在行业
	
	private String goodResume;//货源摘要
	
	private String infomation;//详细介绍
	private String bussInfo;//产品介绍
	
	private String contactQQ;
	private String contactWX;//联系微信
	private String contactBU;//联系公众号
	private String contactPhone;
	private String contactMobile;
	private String contactAddress;
	private String contactUser;
	
	
	@Override
	public String getTableName() {
		return "weiquan_"+Goods.class.getSimpleName();
	}
	
	public long getGoodsId() {
		return goodsId;
	}

	public void setGoodsId(long goodsId) {
		this.goodsId = goodsId;
	}

	public String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName;
	}

	public long getIndustryId() {
		return industryId;
	}

	public void setIndustryId(long industryId) {
		this.industryId = industryId;
	}

	public String getGoodResume() {
		return goodResume;
	}

	public void setGoodResume(String goodResume) {
		this.goodResume = goodResume;
	}

	public String getInfomation() {
		return infomation;
	}

	public void setInfomation(String infomation) {
		this.infomation = infomation;
	}

	public String getContactQQ() {
		return contactQQ;
	}

	public void setContactQQ(String contactQQ) {
		this.contactQQ = contactQQ;
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}

	public String getContactMobile() {
		return contactMobile;
	}

	public void setContactMobile(String contactMobile) {
		this.contactMobile = contactMobile;
	}

	public String getContactAddress() {
		return contactAddress;
	}

	public void setContactAddress(String contactAddress) {
		this.contactAddress = contactAddress;
	}

	public String getContactUser() {
		return contactUser;
	}

	public void setContactUser(String contactUser) {
		this.contactUser = contactUser;
	}

	public String getContactWX() {
		return contactWX;
	}

	public void setContactWX(String contactWX) {
		this.contactWX = contactWX;
	}

	public String getContactBU() {
		return contactBU;
	}

	public void setContactBU(String contactBU) {
		this.contactBU = contactBU;
	}

	public String getBussInfo() {
		return bussInfo;
	}

	public void setBussInfo(String bussInfo) {
		this.bussInfo = bussInfo;
	}

}

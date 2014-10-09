package com.weiquan.domain;

import com.weiquan.domain.annotation.AttrAnnotation;

/**
 * ¹«ÖÚºÅ
 * @author ZL
 *
 */
public class Bussiness extends CommonIndex implements ObjectLabelInterface{
	private long bussinessId;
	private String name;
	private int createTime;
	private String memo;
	@AttrAnnotation
	private long industryId;
	
	@Override
	public String getTableName() {
		return "weiquan_"+Bussiness.class.getSimpleName();
	}
	
	public long getBussinessId() {
		return bussinessId;
	}
	public void setBussinessId(long bussinessId) {
		this.bussinessId = bussinessId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getCreateTime() {
		return createTime;
	}
	public void setCreateTime(int createTime) {
		this.createTime = createTime;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public long getIndustryId() {
		return industryId;
	}
	public void setIndustryId(long industryId) {
		this.industryId = industryId;
	}
}

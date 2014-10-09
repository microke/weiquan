package com.weiquan.domain;

public class QueryParam extends PageContral{
	private long serialno;
	private int beginDate;
	private int endDate;
	private String name;
	
	
	public long getSerialno() {
		return serialno;
	}
	public void setSerialno(long serialno) {
		this.serialno = serialno;
	}
	public int getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(int beginDate) {
		this.beginDate = beginDate;
	}
	public int getEndDate() {
		return endDate;
	}
	public void setEndDate(int endDate) {
		this.endDate = endDate;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}

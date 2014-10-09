package com.weiquan.domain;

public class SysAttribute {
	private long attrId;
	private long groupId;
	private String attrName;
	private String attrValue;
	private int language;
	private int indexNo;
	private int attrValueType;
	private int level;
	public long getAttrId() {
		return attrId;
	}
	public void setAttrId(long attrId) {
		this.attrId = attrId;
	}
	public String getAttrName() {
		return attrName;
	}
	public void setAttrName(String attrName) {
		this.attrName = attrName;
	}
	public String getAttrValue() {
		return attrValue;
	}
	public void setAttrValue(String attrValue) {
		this.attrValue = attrValue;
	}
	public int getLanguage() {
		return language;
	}
	public void setLanguage(int language) {
		this.language = language;
	}
	public int getIndexNo() {
		return indexNo;
	}
	public void setIndexNo(int index) {
		this.indexNo = index;
	}
	public int getAttrValueType() {
		return attrValueType;
	}
	public void setAttrValueType(int attrValueType) {
		this.attrValueType = attrValueType;
	}
	public long getGroupId() {
		return groupId;
	}
	public void setGroupId(long groupId) {
		this.groupId = groupId;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
}

package com.weiquan.domain;

import java.util.List;

public class Tag  implements Cloneable{
	private int tagId;
	private String tagName;
	private String tagType;
	private String tagUrl;
	private int orderNo;
	private int level;
	private List<Sheet> sheets;
	@Override
	public Tag clone()  {
		Tag tag = null;
		try{
			
			tag = (Tag)super.clone();
		}catch(CloneNotSupportedException e){
			e.printStackTrace();
		}
		return tag;
	}
	
	public int getTagId() {
		return tagId;
	}
	public void setTagId(int tagId) {
		this.tagId = tagId;
	}
	public String getTagName() {
		return tagName;
	}
	public void setTagName(String tagName) {
		this.tagName = tagName;
	}
	public String getTagType() {
		return tagType;
	}
	public void setTagType(String tagType) {
		this.tagType = tagType;
	}
	public String getTagUrl() {
		return tagUrl;
	}
	public void setTagUrl(String tagUrl) {
		this.tagUrl = tagUrl;
	}
	public int getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(int orderNo) {
		this.orderNo = orderNo;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public List<Sheet> getSheets() {
		return sheets;
	}
	public void setSheets(List<Sheet> sheets) {
		this.sheets = sheets;
	}
}

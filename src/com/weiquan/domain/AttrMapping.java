package com.weiquan.domain;

import java.util.List;

public class AttrMapping {
	private long serilno;
	private String javaName;
	private String attrName;
	private long groupId;
	private int level = -1;
	private int model = -1;
	private List<SysAttribute> attributes;
	
	public String getJavaName() {
		return javaName;
	}
	public void setJavaName(String javaName) {
		this.javaName = javaName;
	}
	public String getAttrName() {
		return attrName;
	}
	public void setAttrName(String attrName) {
		this.attrName = attrName;
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
	public int getModel() {
		return model;
	}
	public void setModel(int model) {
		this.model = model;
	}
	public long getSerilno() {
		return serilno;
	}
	public void setSerilno(long serilno) {
		this.serilno = serilno;
	}
	public List<SysAttribute> getAttributes() {
		return attributes;
	}
	public void setAttributes(List<SysAttribute> attributes) {
		this.attributes = attributes;
	}
}

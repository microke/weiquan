package com.weiquan.domain;

import java.util.List;

/**
 * Œ¢–≈»∫
 * @author ZL
 *
 */
public class Group extends CommonIndex implements ObjectLabelInterface{
	private long groupId;
	private long sourceId;
	private long industryId;
	private long userId;
	private String groupName;
	private String groupSimpleName;
	private String memo;
	private long groupUrl;
	private int createTime;
	private String test1;
	private int test2;
	
	public Group(){}
	public Group(long id){
		this.groupId = id;
	}
	
	public int getCreateTime() {
		return createTime;
	}

	public void setCreateTime(int createTime) {
		this.createTime = createTime;
	}

	@Override
	public String getTableName() {
		return "weiquan_"+Group.class.getSimpleName();
	}
	
	public long getGroupId() {
		return groupId;
	}
	public void setGroupId(long groupId) {
		this.groupId = groupId;
	}
	public long getSourceId() {
		return sourceId;
	}
	public void setSourceId(long sourceId) {
		this.sourceId = sourceId;
	}
	public long getUserId() {
		return userId;
	}
	public void setUserId(long userId) {
		this.userId = userId;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getGroupSimpleName() {
		return groupSimpleName;
	}
	public void setGroupSimpleName(String groupSimpleName) {
		this.groupSimpleName = groupSimpleName;
	}
	
	public long getIndustryId() {
		return industryId;
	}
	public void setIndustryId(long industryId) {
		this.industryId = industryId;
	}
	public long getGroupUrl() {
		return groupUrl;
	}
	public void setGroupUrl(long groupUrl) {
		this.groupUrl = groupUrl;
	}

	public String getTest1() {
		return test1;
	}
	public void setTest1(String test1) {
		this.test1 = test1;
	}
	public int getTest2() {
		return test2;
	}
	public void setTest2(int test2) {
		this.test2 = test2;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
}

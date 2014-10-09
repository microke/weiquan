package com.weiquan.domain;

/**
 * ÐÂÎÅ
 * @author ZL
 *
 */
public class NewInfo {
	private long newId;
	private long newUrl;
	private String title;
	private String newSimpleIntroduce;
	private String memo;
	private long sourceId;
	private int creatDate;
	private int creatTime;
	private String channel;
	public long getNewId() {
		return newId;
	}
	public void setNewId(long newId) {
		this.newId = newId;
	}
	public long getNewUrl() {
		return newUrl;
	}
	public void setNewUrl(long newUrl) {
		this.newUrl = newUrl;
	}
	public String getNewSimpleIntroduce() {
		return newSimpleIntroduce;
	}
	public void setNewSimpleIntroduce(String newSimpleIntroduce) {
		this.newSimpleIntroduce = newSimpleIntroduce;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public long getSourceId() {
		return sourceId;
	}
	public void setSourceId(long sourceId) {
		this.sourceId = sourceId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getCreatDate() {
		return creatDate;
	}
	public void setCreatDate(int creatDate) {
		this.creatDate = creatDate;
	}
	public int getCreatTime() {
		return creatTime;
	}
	public void setCreatTime(int creatTime) {
		this.creatTime = creatTime;
	}
	public String getChannel() {
		return channel;
	}
	public void setChannel(String channel) {
		this.channel = channel;
	}
}

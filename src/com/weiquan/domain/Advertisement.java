package com.weiquan.domain;

public class Advertisement extends CommonIndex{
	private long adId;
	private String adName;
	private int createDate;
	private int beginDate;
	private int endDate;
	private int adType;//0-��ҳ�ö���� 1-�м�������
	private int sheetId;//����Sheet
	private String channelName;
	private String memo;
	@Override
	public String getTableName() {
		return "WEIQUAN_ADVERTISEMENT";
	}
	public long getAdId() {
		return adId;
	}
	public void setAdId(long adId) {
		this.adId = adId;
	}
	public String getAdName() {
		return adName;
	}
	public void setAdName(String adName) {
		this.adName = adName;
	}
	public int getCreateDate() {
		return createDate;
	}
	public void setCreateDate(int createDate) {
		this.createDate = createDate;
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
	public int getAdType() {
		return adType;
	}
	public void setAdType(int adType) {
		this.adType = adType;
	}
	public String getChannelName() {
		return channelName;
	}
	public void setChannelName(String channelName) {
		this.channelName = channelName;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public int getSheetId() {
		return sheetId;
	}
	public void setSheetId(int sheetId) {
		this.sheetId = sheetId;
	}
}

package com.weiquan.domain;

public class Image implements ObjectLabelInterface{
	private long imageId;
	
	private String directory;
	
	private String fileName;
	
	private String imageSource;
	
	
	private int imageType;//群类型 1-展示图片， 2-二维码图片
	
	private long relationNo;
	
	private String tableName;
	
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	@Override
	public String getTableName() {
		return tableName;
	}

	public long getImageId() {
		return imageId;
	}

	public void setImageId(long imageId) {
		this.imageId = imageId;
	}

	public String getDirectory() {
		return directory;
	}

	public void setDirectory(String directory) {
		this.directory = directory;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getImageSource() {
		return imageSource;
	}

	public void setImageSource(String imageSource) {
		this.imageSource = imageSource;
	}

	public long getRelationNo() {
		return relationNo;
	}

	public void setRelationNo(long relationNo) {
		this.relationNo = relationNo;
	}

	public int getImageType() {
		return imageType;
	}

	public void setImageType(int imageType) {
		this.imageType = imageType;
	}

	
	
}

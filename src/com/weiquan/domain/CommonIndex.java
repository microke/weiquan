package com.weiquan.domain;

import java.util.List;

public abstract class CommonIndex implements ObjectLabelInterface{
	private long clickCount;
	private long pariseCount;//ºÃÆÀ
	private long mediumnCount;//ÖÐÆÀ
	private long negativeCount;//²îÆÀ
	private long superIndex;
	private List<Image> imageList;
	private Image groupShowImage;
	private Image qrImage;//¶þÎ¬ÂëÍ¼Æ¬
	
	public long getClickCount() {
		return clickCount;
	}
	public void setClickCount(long clickCount) {
		this.clickCount = clickCount;
	}
	public long getPariseCount() {
		return pariseCount;
	}
	public void setPariseCount(long pariseCount) {
		this.pariseCount = pariseCount;
	}
	public long getMediumnCount() {
		return mediumnCount;
	}
	public void setMediumnCount(long mediumnCount) {
		this.mediumnCount = mediumnCount;
	}
	public long getNegativeCount() {
		return negativeCount;
	}
	public void setNegativeCount(long negativeCount) {
		this.negativeCount = negativeCount;
	}
	public long getSuperIndex() {
		return superIndex;
	}
	public void setSuperIndex(long superIndex) {
		this.superIndex = superIndex;
	}
	public List<Image> getImageList() {
		return imageList;
	}
	public void setImageList(List<Image> imageList) {
		this.imageList = imageList;
	}
	public Image getGroupShowImage() {
		return groupShowImage;
	}
	public void setGroupShowImage(Image groupShowImage) {
		this.groupShowImage = groupShowImage;
	}
	public Image getQrImage() {
		return qrImage;
	}
	public void setQrImage(Image qrImage) {
		this.qrImage = qrImage;
	}
	
	
}

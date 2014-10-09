package com.weiquan.domain;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;

public class Element extends PageContral{
	private long id;
	private int sourceType;
	private String name;
	private String simpleIntroduce;
	private Image groupShowImage;//
	private Image qrImage;//¶þÎ¬ÂëÍ¼Æ¬
	private String clickUrl;
	private List<Image> showImages;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getSourceType() {
		return sourceType;
	}
	public void setSourceType(int sourceType) {
		this.sourceType = sourceType;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		try {
			if(name.getBytes("UTF-8").length>27){
				this.name = new String(Arrays.copyOfRange(name.getBytes("UTF-8"),0 ,27),Charset.forName("UTF-8"))+"...";
			}else{
				this.name = name;
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
	public String getSimpleIntroduce() {
		return simpleIntroduce;
	}
	public void setSimpleIntroduce(String simpleIntroduce) {
		this.simpleIntroduce = simpleIntroduce;
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
	public List<Image> getShowImages() {
		return showImages;
	}
	public void setShowImages(List<Image> showImages) {
		this.showImages = showImages;
	}
	public String getClickUrl() {
		return clickUrl;
	}
	public void setClickUrl(String clickUrl) {
		this.clickUrl = clickUrl;
	}
}

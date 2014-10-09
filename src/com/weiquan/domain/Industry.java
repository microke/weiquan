package com.weiquan.domain;

/**
 * 行业
 * @author ZL
 *
 */
public class Industry {
	/**
	 * 编号
	 */
	private long industryId;
	
	/**
	 * 行业名称
	 */
	private String name;
	
	/**
	 * 行业描述
	 */
	private String memo;
	
	/**
	 * 行业图片编号
	 */
	private long logoImage;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public long getIndustryId() {
		return industryId;
	}

	public void setIndustryId(long industryId) {
		this.industryId = industryId;
	}

	public long getLogoImage() {
		return logoImage;
	}

	public void setLogoImage(long logoImage) {
		this.logoImage = logoImage;
	}

	
}

package com.weiquan.domain;

/**
 * ��ҵ
 * @author ZL
 *
 */
public class Industry {
	/**
	 * ���
	 */
	private long industryId;
	
	/**
	 * ��ҵ����
	 */
	private String name;
	
	/**
	 * ��ҵ����
	 */
	private String memo;
	
	/**
	 * ��ҵͼƬ���
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

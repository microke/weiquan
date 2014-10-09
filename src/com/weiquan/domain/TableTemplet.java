package com.weiquan.domain;

import java.util.List;

import com.weiquan.common.WqException;

public class TableTemplet {
	
	private long templetId;
	private String templetName;
	private boolean page;//�Ƿ��ҳ
	private int size;
	private int columnCount;
	private int pageType;//--��������JSP��֧�ֵķ�ҳ��Ӧ
	
	public int getLimit(){
		return this.size*this.columnCount;
	}
	
	public int getLayoutSize(){
		return 12/this.columnCount;
	}
	
	public long getTempletId() {
		return templetId;
	}
	public void setTempletId(long templetId) {
		this.templetId = templetId;
	}
	public String getTempletName() {
		return templetName;
	}
	public void setTempletName(String templetName) {
		this.templetName = templetName;
	}
	public boolean isPage() {
		return page;
	}
	public void setPage(boolean page) {
		this.page = page;
	}
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}
	public int getColumnCount() {
		return columnCount;
	}
	public void setColumnCount(int columnCount) {
		if(12%columnCount != 0){
			throw new WqException("errorCount");
		}
		this.columnCount = columnCount;
	}
	public int getPageType() {
		return pageType;
	}
	public void setPageType(int pageType) {
		this.pageType = pageType;
	}
	
}

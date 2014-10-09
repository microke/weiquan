package com.weiquan.domain;

public class ElementQuery extends QueryParam{
	private String sourceName;
	private long sourceId;
	private long sheetId;
	
	public String getSourceName() {
		return sourceName;
	}

	public void setSourceName(String sourceName) {
		this.sourceName = sourceName;
	}

	public long getSourceId() {
		return sourceId;
	}

	public void setSourceId(long sourceId) {
		this.sourceId = sourceId;
	}

	public long getSheetId() {
		return sheetId;
	}

	public void setSheetId(long sheetId) {
		this.sheetId = sheetId;
	}
	
}

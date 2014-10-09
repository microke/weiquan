package com.weiquan.domain;

import java.util.List;

import com.weiquan.domain.annotation.AttrAnnotation;

public class Sheet implements Cloneable{
	private long sheetId;//sheet编号
	@AttrAnnotation
	private int sheetType;//sheet类型
	/*public static final int ELEMENT_STYLE_GRID = 0;//12宫格
	public static final int ELEMENT_STYLE_ARTICLE = 1;//
	public static final int ELEMENT_STYLE_AD_TOP = 2;
	public static final int ELEMENT_STYLE_AD_CROSSWISE = 3;
	public static final int ELEMENT_STYLE_AD_COLUMN = 4;*/
	private long tagId;//所属tags
	private String sheetName;
	private String sheetIntroduce;
	private int sheetIndex;
	private String recommendUrl;
	private String recommendName;
	private String moreUrl;
	private TableTemplet tableTemplet;
	private String sourceName;
	private long sourceId;
	private List<Element> elements;
	public Sheet(){
		
	}
	public Sheet(long sheetId){
		this.sheetId = sheetId;
	}
	
	public ElementQuery toElementQuery(){
		ElementQuery query = new ElementQuery();
		query.setStart(0);
		query.setSheetId(this.sheetId);
		query.setSourceName(sourceName);
		query.setSourceId(sourceId);
		query.setLimit(this.tableTemplet.getLimit());
		return query;
	}
	@Override
	public Sheet clone()  {
		Sheet obj = null;
		try{
			
			obj = (Sheet)super.clone();
		}catch(CloneNotSupportedException e){
			e.printStackTrace();
		}
		return obj;
	}
	
	public long getSheetId() {
		return sheetId;
	}
	public void setSheetId(long sheetId) {
		this.sheetId = sheetId;
	}
	public String getSheetName() {
		return sheetName;
	}
	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}
	public String getSheetIntroduce() {
		return sheetIntroduce;
	}
	public void setSheetIntroduce(String sheetIntroduce) {
		this.sheetIntroduce = sheetIntroduce;
	}
	public int getSheetType() {
		return sheetType;
	}
	public void setSheetType(int sheetType) {
		this.sheetType = sheetType;
	}
	public long getTagId() {
		return tagId;
	}
	public void setTagId(long tagId) {
		this.tagId = tagId;
	}
	public int getSheetIndex() {
		return sheetIndex;
	}
	public void setSheetIndex(int sheetIndex) {
		this.sheetIndex = sheetIndex;
	}
	public String getRecommendUrl() {
		return recommendUrl;
	}
	public void setRecommendUrl(String recommendUrl) {
		this.recommendUrl = recommendUrl;
	}
	public String getMoreUrl() {
		return moreUrl;
	}
	public void setMoreUrl(String moreUrl) {
		this.moreUrl = moreUrl;
	}
	public String getRecommendName() {
		return recommendName;
	}
	public void setRecommendName(String recommendName) {
		this.recommendName = recommendName;
	}
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
	public TableTemplet getTableTemplet() {
		return tableTemplet;
	}
	public void setTableTemplet(TableTemplet tableTemplet) {
		this.tableTemplet = tableTemplet;
	}
	public List<Element> getElements() {
		return elements;
	}
	public void setElements(List<Element> elements) {
		this.elements = elements;
	}
}

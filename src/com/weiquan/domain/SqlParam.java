package com.weiquan.domain;

import java.util.ArrayList;
import java.util.List;

public class SqlParam {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int count = 0;
	
	private int start = 0;
	
	private int limit = 0;
	
	private int index = 0;
	
	private String pageInfo = "";

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}
	
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}
	
	///////////////////////////////////////////////////////
	
	public final static int PAGESIZE = 10;
	
    /**
     * 页数
     */
    private int pageNum = 0; //0表示要求重新查询
    /**
     * 页号
     */
    private int pageNo = 1; //从1开始计数
    /**
     * 页大小
     */
    private int pageSize = PAGESIZE;

    /**
     * 是否分页
     */
    private boolean pageCtrl = true;


    private int recNum;

    /**
     * 查询结果
     */
    private List<Object> data = new ArrayList<Object>();
    
    /**
     *
     */
    public SqlParam() {

    }


    public List<Object> getData() {
        return data;
    }

    public void setData(List<Object> data) {
        this.data = data;
        if (!pageCtrl && data != null) {
            this.recNum = data.size();
        }
    }

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public int getPageNo() {
        return pageNo;
    }

    public void setPageNo(int pageNo) {
        if (pageNo != 0) {
            this.pageNo = pageNo;
        }
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public void setPageInfo(int recNum) {
        this.recNum = recNum;
        this.pageNo = 1;
        this.pageNum = (recNum + pageSize - 1) / pageSize;
    }

    /**
     * 需要重新读取查询数据记录数
     * @return boolean
     */
    public boolean isChangeDataSize() {
        return pageCtrl && pageNum == 0;
    }

    public int getDataFrom() {
        return (pageNo - 1) * pageSize + 1;
    }

    public int getDataTo() {
        return pageNo * pageSize;
    }

    public boolean isPageCtrl() {
        return pageCtrl;
    }

    public void setPageCtrl(boolean pageCtrl) {
        this.pageCtrl = pageCtrl;
    }

    public int getRecNum() {
        return recNum;
    }

    public void setRecNum(int recNum) {
        this.recNum = recNum;
    }

	public String getPageInfo() {
		return pageInfo;
	}
}

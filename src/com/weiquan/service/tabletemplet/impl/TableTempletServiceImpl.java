package com.weiquan.service.tabletemplet.impl;
import java.util.List;
import org.apache.log4j.Logger;
import com.weiquan.domain.TableTemplet;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.TableTempletDao;
import com.weiquan.service.tabletemplet.TableTempletService;
import com.weiquan.service.ServiceCommonInterface;
public class TableTempletServiceImpl implements TableTempletService, ServiceCommonInterface<TableTemplet>{
	private Logger logger = Logger.getLogger(TableTempletServiceImpl.class);
	private TableTempletDao tableTempletDao;

	@Override
	public TableTemplet getInfoById(long id){
		return null;
	}
	@Override
	public TableTemplet getInfoById(TableTemplet arg){
		return this.tableTempletDao.get(arg);
	}
	public List<TableTemplet> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(TableTemplet arg){
		this.tableTempletDao.update(arg);
	}
	@Override
	public void insert(TableTemplet arg){
		this.tableTempletDao.insert(arg);
	}
	public void setTableTempletDao(TableTempletDao arg){
		this.tableTempletDao = arg;
	}
}
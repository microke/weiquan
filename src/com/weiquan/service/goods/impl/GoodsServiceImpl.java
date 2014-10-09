package com.weiquan.service.goods.impl;
import java.util.List;
import org.apache.log4j.Logger;

import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.domain.Goods;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.GoodsDao;
import com.weiquan.service.goods.GoodsService;
import com.weiquan.service.ServiceCommonInterface;
public class GoodsServiceImpl implements GoodsService, ServiceCommonInterface<Goods>{
	private Logger logger = Logger.getLogger(GoodsServiceImpl.class);
	private GoodsDao goodsDao;

	@Override
	public Goods getInfoById(long id){
		return null;
	}
	@Override
	public Goods getInfoById(Goods arg){
		return this.goodsDao.get(arg);
	}
	public List<Goods> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(Goods arg){
		this.goodsDao.update(arg);
	}
	@Override
	public void insert(Goods arg){
		this.goodsDao.insert(arg);
	}
	public void setGoodsDao(GoodsDao arg){
		this.goodsDao = arg;
	}
}
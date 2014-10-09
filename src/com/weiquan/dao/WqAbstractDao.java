package com.weiquan.dao;

import java.util.List;

public abstract interface WqAbstractDao<T> {
		
		/**
		 * 根据键值获取单个对象
		 * 
		 * @param obj
		 *            Object
		 * @return Object
		 */
		public T get(T obj);
		
/*		*//**
		 * 根据键值获取单个对象
		 * 
		 * @param obj
		 *            Object
		 * @return Object
		 *//*
		public T get(long id);*/
		
		/**
		 * 插入对象
		 * 
		 * @param obj
		 *            Object
		 */
		public void insert(T obj);

		/**
		 * 更新对象
		 * 
		 * @param obj
		 *            Object
		 */
		public int update(T obj) ;
		
		public void delete(String sqlkey);
}

package com.weiquan.dao;

import java.util.List;

public abstract interface WqAbstractDao<T> {
		
		/**
		 * ���ݼ�ֵ��ȡ��������
		 * 
		 * @param obj
		 *            Object
		 * @return Object
		 */
		public T get(T obj);
		
/*		*//**
		 * ���ݼ�ֵ��ȡ��������
		 * 
		 * @param obj
		 *            Object
		 * @return Object
		 *//*
		public T get(long id);*/
		
		/**
		 * �������
		 * 
		 * @param obj
		 *            Object
		 */
		public void insert(T obj);

		/**
		 * ���¶���
		 * 
		 * @param obj
		 *            Object
		 */
		public int update(T obj) ;
		
		public void delete(String sqlkey);
}

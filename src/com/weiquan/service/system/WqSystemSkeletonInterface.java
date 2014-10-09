package com.weiquan.service.system;

import com.weiquan.common.WqException;

public interface WqSystemSkeletonInterface {
	public void init(System arg) throws WqException;
	public void destory(System arg) throws WqException;
}

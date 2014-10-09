package com.weiquan.common;

public class WqCommonUtil {
	public static void validNullObject(Object object) throws WqException{
		if( object == null){
			throw new WqException("ERROR.ARG.NULLVALUE");
		} 
	}
}

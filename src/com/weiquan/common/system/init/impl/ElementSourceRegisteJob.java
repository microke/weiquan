package com.weiquan.common.system.init.impl;

import java.util.List;

import com.weiquan.common.system.init.AbstractSystemInitJob;
import com.weiquan.service.element.ElementService;
import com.weiquan.service.element.source.ElementSourceInterface;

public class ElementSourceRegisteJob extends AbstractSystemInitJob {
	private ElementService elementService;
	private List<ElementSourceInterface> elementSourceInterfaces;
	
	@Override
	protected void doSystemJob() throws Exception {
		if(elementSourceInterfaces != null){
			for(ElementSourceInterface source : elementSourceInterfaces){
				this.elementService.registerSource(source);
			}
		}
	}

	public void setElementService(ElementService elementService) {
		this.elementService = elementService;
	}

	public void setElementSourceInterfaces(
			List<ElementSourceInterface> elementSourceInterfaces) {
		this.elementSourceInterfaces = elementSourceInterfaces;
	}

}
